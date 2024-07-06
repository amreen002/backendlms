
const { Op, where } = require('sequelize');
const { Batch, User, Role, Teacher, Courses, sequelize } = require('../models')
const generateEnquiryId = async (id, CoursesId) => {
    try {
        let courses = await Courses.findOne({ where: { id: CoursesId } });
        const prefix = courses.name.split(' ').map(word => word[0]).join('').toUpperCase();
        const paddedId = id.toString().padStart(3, '0'); // Ensures the ID is at least 3 digits
        const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const padId = CoursesId.toString(); // Ensure CoursesId is converted to string
        return `${prefix}${paddedId}${suffix}${padId}`;
    } catch (error) {
        console.error(error);
        throw new Error("Error generating BatchEniqueId");
    }
};

exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;
        let batchs = await Batch.create(req.body, { transaction });
        const BatchEniqueId = await generateEnquiryId(batchs.id, batchs.CoursesId); // Await for the promise to resolve

        // Update the batch with the generated BatchEniqueId
        await Batch.update(
            { BatchEniqueId: BatchEniqueId.toString() },
            { where: { id: batchs.id }, transaction }
        );

        await transaction.commit();
        return res.status(200).json({
            batchs: batchs,
            success: true,
            message: "Batchs Created Successfully"
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({
            error: error,
            success: false,
            message: "Batchs error"
        });
    }
};


exports.findOne = async (req, res) => {
    try {
        let batchs = await Batch.findOne({ where: { id: req.params.batchesId }, include: [{ model: User, include: [{ model: Role }] }, { model: Teacher }, { model: Courses }], order: [['updatedAt', 'DESC']] });
        res.status(200).json({
            batchs: batchs,
            success: true,
            message: "get one Batch by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Batch'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        /*      const searchTerm = req.query.searchTerm;
             if (searchTerm) {
                 where = {
                     [Op.or]: [
                         { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                         // Add more fields for searching if needed
                     ],
                 };
             }
        */

        let where;
        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({
            where: { id: loggedInUserId }, attributes: [
                "id",
                "name",
                "userName",
                "phoneNumber",
                "email",
                "assignToUsers",
                "departmentId",
                "teacherId",
                "studentId",
                "roleName",
                "image",
                "src",
                "address",
                "message",
                "active",
            ], include: [{ model: Role }]
        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator"||loggedInUser.Role.Name == "Super Admin")
            where = {}
        else {
            where = { userId: loggedInUserId }
        }
        let batchs = await Batch.findAll({
            where,
            attributes: [
                'id',
                'Title',
                'BatchEniqueId',
                'BatchEndTime',
                'InstructorId',
                'CoursesId',
                'BatchDuration',
                'BatchsInWeek',
                'StartedAtWeek',
                'BatchStatus',
                'BatchDatails',
                'userId',
                'BatchStartTime', 
            ], include: [{ model: User, include: [{ model: Role }] }, { model: Teacher }, { model: Courses }], order: [['updatedAt', 'DESC']]
        })

        for (let index = 0; index < batchs.length; index++) {
            const StartTime = batchs[index].BatchStartTime;
            const EndTime = batchs[index].BatchEndTime;
            const formatTime = (timeString) => {
                const [hours, minutes] = timeString.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
            };
        
            batchs[index].BatchStartTime = formatTime(StartTime);
            batchs[index].BatchEndTime = formatTime(EndTime);
        }


        res.status(200).json({
            batchs: batchs,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};

exports.findAllUsers = async (req, res) => {
    try {

        let batchs = await Batch.findAll({
            attributes: [
                'id',
                'Title',
                'BatchEniqueId',
                'BatchEndTime',
                'InstructorId',
                'CoursesId',
                'BatchDuration',
                'BatchsInWeek',
                'StartedAtWeek',
                'BatchStatus',
                'BatchDatails',
                'userId',
                'BatchStartTime', 
            ], include: [{ model: User, include: [{ model: Role }] }, { model: Teacher }, { model: Courses }], order: [['updatedAt', 'DESC']]
        })

        for (let index = 0; index < batchs.length; index++) {
            const StartTime = batchs[index].BatchStartTime;
            const EndTime = batchs[index].BatchEndTime;
            const formatTime = (timeString) => {
                const [hours, minutes] = timeString.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
            };
        
            batchs[index].BatchStartTime = formatTime(StartTime);
            batchs[index].BatchEndTime = formatTime(EndTime);
        }


        res.status(200).json({
            batchs: batchs,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};
exports.update = async (req, res) => {
    let transaction;
    try {
        req.body.userId = req.profile.id;

        // Start a transaction
        transaction = await sequelize.transaction();

        // Update the batch
        let batchs = await Batch.update(req.body, {
            where: { id: req.params.batchesId },
            returning: true, // Ensure the updated row(s) are returned
            transaction // Use the transaction
        });
        // Update the batch
        batchs = await Batch.findOne({
            where: { id: req.params.batchesId },
            returning: true, // Ensure the updated row(s) are returned
            transaction // Use the transaction
        });


        // Generate the unique BatchEniqueId
        const BatchEniqueId = await generateEnquiryId(req.params.batchesId, batchs.CoursesId);

        // Update the batch with the generated BatchEniqueId
        await Batch.update(
            { BatchEniqueId: BatchEniqueId.toString() },
            { where: { id: req.params.batchesId }, transaction }
        );

        // Commit the transaction
        await transaction.commit();

        // Return the updated batch
        return res.status(200).json({
            batchs: batchs,
            success: true,
            message: "Batch updated successfully"
        });
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) {
            await transaction.rollback();
        }
        console.error(error);
        return res.status(500).json({
            error: error,
            success: false,
            message: "Error while updating the batch"
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const batchs = await Batch.destroy({ where: { id: req.params.batchesId } });
        res.status(200).json({
            batchs: batchs,
            success: true,
            message: "Delete Successfully Batchs"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Batchs not found'
        });
    }
}

