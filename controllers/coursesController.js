
const { Op, where, } = require('sequelize');
const { Courses, Batch, User, Role, Categories, Student, Address, Teacher, Topic, Video, Lession, sequelize } = require('../models')


const generateEnquiryId = async (id) => {
    try {

        const prefix = "COB";
        const paddedId = id.toString().padStart(3, '0'); // Ensures the ID is at least 3 digits
        // Get current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

        const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const padId = id.toString(); // Ensure CoursesId is converted to string

        return `${prefix}${paddedId}${timestamp}${suffix}${padId}`;
    } catch (error) {
        console.error(error);
        throw new Error("Error generating BatchEniqueId");
    }
};

const cleanUpArrayFields = (data) => {
    const fieldsToClean = ['Students', 'Batches', 'Topics', 'Videos', 'Lessions'];

    fieldsToClean.forEach(field => {
        if (data[field]) {
            // Remove potential duplicates
            if (Array.isArray(data[field])) {
                data[field] = data[field].filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                );

                // Convert single-element array to object
                if (data[field].length == 1) {
                    data[field] = data[field];
                }
            }
        }
    });
    return data;
};

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let data = {
            name: req.body.name,
            userId: req.profile.id,
            CoursePrice: req.body.CoursePrice,
            CourseCategoryId: req.body.CourseCategoryId,
            CourseUplod: req.file.path,
            CourseDuration: req.body.CourseDuration,
            AboutCourse: req.body.AboutCourse,
            Description: req.body.Description,
        }
        console.log(req.body)
        let courses = await Courses.create(data, { transaction })
        const CourseCode = await generateEnquiryId(courses.id);
        await Courses.update(
            { CourseCode: CourseCode.toString() },
            { where: { id: courses.id }, transaction }
        );
        await transaction.commit();
        return res.status(200).json({
            courses: courses,
            success: true,
            message: "Class Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Class error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const courses = await Courses.findOne({ where: { id: req.params.coursesId }, include: [{ model: User, include: [{ model: Role }] }, { model: Categories }, { model: Student }], order: [['updatedAt', 'DESC']],transaction });
        await transaction.commit();
        res.status(200).json({
            courses: courses,
            success: true,
            message: "get one Class by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Class'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction;
    try {
            // Start a transaction
            transaction = await sequelize.transaction();
            let where;
            let userId = req.profile.id;
    
            const loggedInUser = await User.findOne({
                where: { id: userId },
                attributes: [
                    "id", "name", "userName", "phoneNumber", "email", "assignToUsers",
                    "departmentId", "teacherId", "studentId", "roleName", "image",
                    "src", "address", "message", "active"
                ],
                include: [{ model: Role }]
            });
            if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator"||loggedInUser.Role.Name == "Super Admin")
                where = "1=1"; // Always true condi
            else {
                where = "courses.userId = :userId";
            }
       // SQL Query
       let coursesQuery = `
       SELECT
           courses.id,
           courses.name,
           courses.CourseDuration,
           courses.CoursePrice,
           courses.CourseCategoryId,
           courses.userId,
           courses.CourseCode,
           courses.CourseUplod,
           courses.Status,
           courses.updatedAt,
           courses.AboutCourse,
           courses.Description,
           COUNT(DISTINCT students.id) AS studentCount,
           COUNT(DISTINCT batches.id) AS batchesCount,
           COUNT(DISTINCT videos.id) AS videoCount,
           COUNT(DISTINCT lessions.id) AS lessionCount,
           JSON_ARRAYAGG(JSON_OBJECT('id', students.id, 'Name', students.Name)) AS Students,
           JSON_ARRAYAGG( JSON_OBJECT('id', batches.id, 'Title', batches.Title)) AS Batches,
           JSON_OBJECT('id', categories.id, 'name', categories.name ) AS Category,
           JSON_OBJECT('id', users.id, 'name', users.name ) AS User,
           JSON_ARRAYAGG( JSON_OBJECT('id', topics.id, 'name', topics.name)) AS Topics,
           JSON_ARRAYAGG( JSON_OBJECT('id', videos.id, 'Title', videos.Title, 'TopicId', videos.TopicId, 'VideoUplod', videos.VideoUplod, 'VideoIframe', videos.VideoIframe)) AS Videos,
           JSON_ARRAYAGG( JSON_OBJECT('id', lessions.id, 'LessionTitle', lessions.LessionTitle, 'TopicId', lessions.TopicId, 'LessionUpload', lessions.LessionUpload)) AS Lessions
       FROM
           courses
       LEFT JOIN (SELECT DISTINCT CoursesId, id, Name FROM students) students ON students.CoursesId = courses.id
       LEFT JOIN (SELECT DISTINCT CoursesId, id, Title FROM batches) batches ON batches.CoursesId = courses.id
       LEFT JOIN categories ON categories.id = courses.CourseCategoryId
       LEFT JOIN users ON users.id = courses.userId
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, name FROM topics) topics ON topics.CoursesId = courses.id
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, Title, TopicId, VideoUplod, VideoIframe FROM videos) videos ON videos.CoursesId = courses.id
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, LessionTitle, TopicId, LessionUpload FROM lessions) lessions ON lessions.CoursesId = courses.id
       WHERE  ${where}
       GROUP BY
           courses.id, categories.id, users.id`;

        // Execute the raw SQL query
        let courses = await sequelize.query(coursesQuery, {
            type: sequelize.QueryTypes.SELECT,
            transaction,
            replacements: {userId:userId }
        });

        // Clean up array fields
        courses = courses.map(course => cleanUpArrayFields(course));
    
            // Initialize total counts
            let totalStudentCount = 0;
            let totalBatchesCount = 0;
            let totalVideoCount = 0;
            let totalLessionCount = 0;
    
            // Sum the student and batch counts
            courses.forEach(course => {
                totalStudentCount += parseInt(course.studentCount, 10) || 0;
                totalBatchesCount += parseInt(course.batchesCount, 10) || 0;
                totalVideoCount += parseInt(course.videoCount, 10) || 0;
                totalLessionCount += parseInt(course.lessionCount, 10) || 0;
            });
    
            await transaction.commit();
            res.status(200).json({
                courses: courses,
                coursescount: courses.length,
                totalStudentCount: totalStudentCount,
                totalBatchesCount: totalBatchesCount,
                totalVideoCount: totalVideoCount,
                totalLessionCount: totalLessionCount,
                success: true,
                message: "Get All Data Success"
            });
    
        } catch (error) {
            console.error(error);
            if (transaction) await transaction.rollback();
            res.status(500).json({
                error: error.message || "Failed to retrieve data",
                success: false,
                message: "Failed to retrieve data"
            });
        }
    
    
    
};
exports.findAllCourse = async (req, res) => {
    let transaction;
    try {
            // Start a transaction
      transaction = await sequelize.transaction();
      let searching = "1=1"; // Default condition to ensure query is valid
      if (req.query.search) {
        const search = req.query.search;
        searching = `courses.name LIKE '%${search}%'   OR topics.name LIKE '%${search}%'  OR lessions.LessionTitle LIKE '%${search}%' `;
      }
        
    
    
       // SQL Query
       let coursesQuery = `
       SELECT
           courses.id,
           courses.name,
           courses.CourseDuration,
           courses.CoursePrice,
           courses.CourseCategoryId,
           courses.userId,
           courses.CourseCode,
           courses.CourseUplod,
           courses.Status,
           courses.updatedAt,
           courses.AboutCourse,
           courses.Description,
           COUNT(DISTINCT students.id) AS studentCount,
           COUNT(DISTINCT batches.id) AS batchesCount,
           COUNT(DISTINCT videos.id) AS videoCount,
           COUNT(DISTINCT lessions.id) AS lessionCount,
           JSON_ARRAYAGG(JSON_OBJECT('id', students.id, 'Name', students.Name)) AS Students,
           JSON_ARRAYAGG(JSON_OBJECT('id', batches.id, 'Title', batches.Title)) AS Batches,
           JSON_OBJECT('id', categories.id, 'name', categories.name) AS Category,
           JSON_OBJECT('id', users.id, 'name', users.name) AS User,
           JSON_ARRAYAGG(JSON_OBJECT('id', topics.id, 'name', topics.name)) AS Topics,
           JSON_ARRAYAGG(JSON_OBJECT('id', videos.id, 'Title', videos.Title, 'TopicId', videos.TopicId, 'VideoUplod', videos.VideoUplod, 'VideoIframe', videos.VideoIframe)) AS Videos,
           JSON_ARRAYAGG(JSON_OBJECT('id', lessions.id, 'LessionTitle', lessions.LessionTitle, 'TopicId', lessions.TopicId, 'LessionUpload', lessions.LessionUpload)) AS Lessions
       FROM
           courses
       LEFT JOIN (SELECT DISTINCT CoursesId, id, Name FROM students) students ON students.CoursesId = courses.id
       LEFT JOIN (SELECT DISTINCT CoursesId, id, Title FROM batches) batches ON batches.CoursesId = courses.id
       LEFT JOIN categories ON categories.id = courses.CourseCategoryId
       LEFT JOIN users ON users.id = courses.userId
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, name FROM topics) topics ON topics.CoursesId = courses.id
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, Title, TopicId, VideoUplod, VideoIframe FROM videos) videos ON videos.CoursesId = courses.id
       LEFT JOIN ( SELECT DISTINCT CoursesId, id, LessionTitle, TopicId, LessionUpload FROM lessions) lessions ON lessions.CoursesId = courses.id
         
       GROUP BY
           courses.id, categories.id, users.id`;

        // Execute the raw SQL query
        let courses = await sequelize.query(coursesQuery, {
            type: sequelize.QueryTypes.SELECT,
            transaction,
        });

        // Clean up array fields
        courses = courses.map(course => cleanUpArrayFields(course));
    
            // Initialize total counts
            let totalStudentCount = 0;
            let totalBatchesCount = 0;
            let totalVideoCount = 0;
            let totalLessionCount = 0;
    
            // Sum the student and batch counts
            courses.forEach(course => {
                totalStudentCount += parseInt(course.studentCount, 10) || 0;
                totalBatchesCount += parseInt(course.batchesCount, 10) || 0;
                totalVideoCount += parseInt(course.videoCount, 10) || 0;
                totalLessionCount += parseInt(course.lessionCount, 10) || 0;
            });
    
            await transaction.commit();
            res.status(200).json({
                courses: courses,
                coursescount: courses.length,
                totalStudentCount: totalStudentCount,
                totalBatchesCount: totalBatchesCount,
                totalVideoCount: totalVideoCount,
                totalLessionCount: totalLessionCount,
                success: true,
                message: "Get All Data Success"
            });
    
        } catch (error) {
            console.error(error);
            if (transaction) await transaction.rollback();
            res.status(500).json({
                error: error.message || "Failed to retrieve data",
                success: false,
                message: "Failed to retrieve data"
            });
        }
    
    
    
};
exports.courseFindOne = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let courseId = req.params.coursesId;

        // Define the corrected raw SQL query
        let coursesQuery = `
            SELECT
                courses.id,
                courses.name,
                courses.CourseDuration,
                courses.CoursePrice,
                courses.CourseCategoryId,
                courses.userId,
                courses.CourseCode,
                courses.CourseUplod,
                courses.Status,
                courses.updatedAt,
                courses.AboutCourse,
                courses.Description,
                COUNT(DISTINCT students.id) AS studentCount,
                COUNT(DISTINCT batches.id) AS batchesCount,
                COUNT(DISTINCT videos.id) AS videoCount,
                COUNT(DISTINCT lessions.id) AS lessionCount,
                JSON_ARRAYAGG(JSON_OBJECT('id', students.id, 'CoursesId', students.CoursesId, 'Name', students.Name)) AS students,
                JSON_ARRAYAGG(JSON_OBJECT('id', batches.id, 'CoursesId', batches.CoursesId, 'Title', batches.Title)) AS batches,
                JSON_OBJECT('id', categories.id, 'name', categories.name) AS category,
                JSON_OBJECT('id', users.id, 'name', users.name) AS user,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', topics.id, 
                        'name', topics.name, 
                        'CoursesId', topics.CoursesId,
                        'videos', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', videos.id,
                                    'Title', videos.Title,
                                    'CoursesId', videos.CoursesId,
                                    'TopicId', videos.TopicId,
                                    'VideoUplod', videos.VideoUplod,
                                    'VideoIframe', videos.VideoIframe
                                )
                            ) 
                            FROM videos 
                            WHERE videos.TopicId = topics.id
                        ),
                        'lessions', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', lessions.id,
                                    'Title', lessions.LessionTitle,
                                    'CoursesId', lessions.CoursesId,
                                    'TopicId', lessions.TopicId,
                                    'LessionUpload', lessions.LessionUpload
                                )
                            ) 
                            FROM lessions 
                            WHERE lessions.TopicId = topics.id
                        )
                    )
                ) AS topics
            FROM
                courses
            LEFT JOIN students ON students.CoursesId = courses.id
            LEFT JOIN batches ON batches.CoursesId = courses.id
            LEFT JOIN categories ON categories.id = courses.CourseCategoryId
            LEFT JOIN users ON users.id = courses.userId
            LEFT JOIN topics ON topics.CoursesId = courses.id
            LEFT JOIN videos ON videos.CoursesId = courses.id
            LEFT JOIN lessions ON lessions.CoursesId = courses.id
            WHERE courses.id = :courseId
            GROUP BY
                courses.id, categories.id, users.id
        `;

        // Execute the raw SQL query

        let courses = await sequelize.query(coursesQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { courseId: courseId }
        });

        const cleanUpArrayFields = (data) => {
            const fieldsToClean = ['students', 'batches', 'topics', 'videos', 'lessions'];

            fieldsToClean.forEach(field => {
                if (data[field]) {
                    // Remove potential duplicates
                    if (Array.isArray(data[field])) {
                        data[field] = data[field].filter((value, index, self) =>
                            index === self.findIndex((t) => (
                                t.id === value.id
                            ))
                        );

                        // Convert single-element array to object
                        if (data[field].length === 1) {
                            data[field] = data[field].filter((value, index, self) =>
                                index === self.findIndex((t) => (
                                    t.id === value.id
                                ))
                            );
                        }
                    }
                }
            });
            return data;
        };

        // Assuming 'courses' contains only one course as you are filtering by courseId
        if (courses.length > 0) {
            courses[0] = cleanUpArrayFields(courses[0]);

        }



        let totalBatchesCount = 0;
        let totalStudentCount = 0;
        let totalVideoCount = 0;
        let totalLessionCount = 0;

        let dateFullYear
        // Sum the student and batch counts
        courses.forEach(course => {
            const date = new Date(course.updatedAt);
            dateFullYear = String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth() + 1).padStart(2, '0') + "/" + date.getFullYear();
            totalStudentCount += parseInt(course.studentCount, 10) || 0;
            totalBatchesCount += parseInt(course.batchesCount, 10) || 0;
            totalVideoCount += parseInt(course.videoCount, 10) || 0;
            totalLessionCount += parseInt(course.lessionCount, 10) || 0;
        });

        let obj = Object.assign({}, courses);
        // Commit the transaction
        await transaction.commit();
        res.status(200).json({
            courses: obj[0],
            coursescount: courses.length,
            totalStudentCount: totalStudentCount,
            totalVideoCount: totalVideoCount,
            totalLessionCount: totalLessionCount,
            Lastupdated: dateFullYear,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }


};



exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const courseId = req.params.coursesId;
        let course = await Courses.findOne({ where: { id: courseId }, order: [['updatedAt', 'DESC']],transaction });
        if (!course.CourseUpload) {
            return res.status(404).json({ message: 'Existing Class Upload not found' });
        }
        let updatedData = {
            name: req.body.name,
            userId: req.profile.id,
            CoursePrice: req.body.CoursePrice,
            CourseCategoryId: req.body.CourseCategoryId,
            CourseUpload: req.file ? req.file.path : course.CourseUpload,
            CourseDuration: req.body.CourseDuration,
            AboutCourse: req.body.AboutCourse,
            Description: req.body.Description,
        };

        // Update the course
        await Courses.update(updatedData, { where: { id: courseId }, order: [['updatedAt', 'DESC']] ,transaction});

        await transaction.commit();
        res.status(200).json({
            course: course,
            success: true,
            message: "Class updated successfully"
        });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({
            error: error.message || "An error occurred while updating the Class",
            success: false,
            message: "Error while updating the Class"
        });
    }
};


exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const courses = await Courses.destroy({ where: { id: req.params.coursesId },transaction });
        await transaction.commit();
        res.status(200).json({
            courses: courses,
            success: true,
            message: "Delete Successfully Class"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Class not found'
        });
    }
}

exports.addcontentcourses = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const courses = await Courses.patch({ where: { id: req.params.coursesId }, transaction });
        if (courses) {
            await Topic.create(req.body, { where: { CoursesId: courses }, transaction })
            await Lession.create(req.body, { where: { CoursesId: courses }, transaction })
            await Video.create(req.body, { where: { CoursesId: courses }, transaction })
        }

        await transaction.commit();
        res.status(200).json({
            courses: courses,
            success: true,
            message: "Successfully Class Content"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Class Content not found'
        });
    }
}

exports.coursecode = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let courseCode = req.params.coursecodeId;

        // SQL Query
        let coursesQuery = `
            SELECT
                courses.id,
    courses.name,
    courses.CourseDuration,
    courses.CoursePrice,
    courses.CourseCategoryId,
    courses.userId,
    courses.CourseCode,
    courses.CourseUplod,
    courses.Status,
        courses.updatedAt,
        courses.AboutCourse,
        courses.Description,
                COUNT(DISTINCT students.id) AS studentCount,
                COUNT(DISTINCT batches.id) AS batchesCount,
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', students.id, 'CoursesId', students.CoursesId, 'Name', students.Name)
                ) AS students,
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', batches.id, 'CoursesId', batches.CoursesId, 'Title', batches.Title)
                ) AS batches,
                JSON_OBJECT('id', categories.id, 'name', categories.name) AS category,
                JSON_OBJECT('id', users.id, 'name', users.name) AS user
            FROM
                courses
            LEFT JOIN students ON students.CoursesId = courses.id
            LEFT JOIN batches ON batches.CoursesId = courses.id
            LEFT JOIN categories ON categories.id = courses.CourseCategoryId
            LEFT JOIN users ON users.id = courses.userId
            WHERE
                courses.CourseCode = :courseCode  
            GROUP BY
                courses.id, categories.id, users.id
        `;

        // Execute the raw SQL query
        let courses = await sequelize.query(coursesQuery, {
            type: sequelize.QueryTypes.SELECT,
            transaction,
            replacements: { courseCode: courseCode }
        });

        // Initialize total counts
        let totalStudentCount = 0;
        let totalBatchesCount = 0;

        // Sum the student and batch counts
        courses.forEach(course => {
            totalStudentCount += parseInt(course.studentCount, 10) || 0;
            totalBatchesCount += parseInt(course.batchesCount, 10) || 0;
        });
        await transaction.commit();
        res.status(200).json({
            courses: courses,
            coursescount: courses.length,
            totalStudentCount: totalStudentCount,
            totalBatchesCount: totalBatchesCount,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};
exports.coursestudents = async (req, res) => {
    let transaction = await sequelize.transaction();
    let courseId = req.params.coursecodeId;

    try {
        let coursesbatch = await Student.findAll({
            where: { CoursesId: courseId }, include: [{
                model: User, include:
                    [{ model: Role }]
            },
            { model: Address },
            { model: Courses },
            { model: Batch, include: [{ model: Teacher, }] },
            ],
            order: [['updatedAt', 'DESC']],
            transaction
        })
        await transaction.commit();
        res.status(200).json({
            courses: coursesbatch,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
}
exports.coursebatches = async (req, res) => {
    let transaction = await sequelize.transaction();
    let courseId = req.params.coursecodeId;

    try {
        let coursesbatch = await Batch.findAll({
            where: { CoursesId: courseId }, include: [{ model: Teacher }, { model: Courses }], order: [['updatedAt', 'DESC']],
            transaction

        })
        await transaction.commit();
        res.status(200).json({
            courses: coursesbatch,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
}