

const { Video, Courses, Topic, Categories, sequelize ,User,Role} = require('../models')
const path =  require("path");
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let videos = [];
        for (let index = 0; index < req.files.length; index++) {
            const originalNameWithoutExtension = path.basename(req.files[index].originalname, path.extname(req.files[index].originalname));
            videos.push({
            path: req.files[index].path,
            name: originalNameWithoutExtension,
          });
        }

        let data = {
            Title: req.body.Title,
            CoursesId: req.body.CoursesId,
            TopicId: req.body.TopicId,
            userId : req.profile.id,
            VideoUplod: videos,
            VideoIframe: req.body.VideoIframe,
        }

        const video = await Video.create(data, { transaction })
        const course = await Courses.findOne({ where: { id: video.CoursesId }, transaction });
        const dat = await Courses.update({ Status: 1 }, { where: { id: course.id }, transaction });
        await transaction.commit();
        return res.status(200).json({
            video: video,
            dat: dat,
            success: true,
            message: "Video Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Video  error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const video = await Video.findOne({ where: { id: req.params.videoId}, include: [{ model: Courses, include: [{ model: Topic }] }],transaction });
        await transaction.commit();
        res.status(200).json({
            video: video,
            success: true,
            message: "get one Video by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Video'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where;
        let subQuery=false
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
            ], include: [{ model: Role }],
            transaction

        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator"||loggedInUser.Role.Name == "Super Admin" )
            where = {}
        else {
            where = { userId: loggedInUserId }
        }
        let conditions2 = { where, include: [{ model: Topic },{ model: Courses, include: [{ model: Categories }] }],order: [['updatedAt', 'DESC']],subQuery,transaction}
        const obj = {
            page: req.query.page,
            model: Video,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const video = await paginationfun.pagination(obj)
     
        await transaction.commit();
        if (video) {
            res.status(200).json({
                video: video,
                success: video.rows.length ?true:false,
                message: video.rows.length ?"Get All Video Data Success":"No data Found"
            });
        }

    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Video Data Success"
        });
    }
}

exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
       let existingVideoPath = await Video.findOne({ where: {  id: req.params.videoId} ,transaction});
        if (!existingVideoPath) {
            return res.status(404).json({ message: 'Existing Video Path not found' });
        }

        let videos = [];
        if (req.files) {
            for (let index = 0; index < req.files.length; index++) {
                const originalNameWithoutExtension = path.basename(req.files[index].originalname, path.extname(req.files[index].originalname));
                videos.push({
                    path: req.files[index].path,
                    name: originalNameWithoutExtension,
                });
            }
        }

        let updatedVideoUpload = existingVideoPath.VideoUplod || [];
        if (req.body.removedFiles) {
            const removedFiles = JSON.parse(req.body.removedFiles);
            updatedVideoUpload = updatedVideoUpload.filter(file => !removedFiles.includes(file.path));
        }
        if (videos.length > 0) {
            updatedVideoUpload = updatedVideoUpload.concat(videos);
        }
        let data = {
            Title: req.body.Title,
            CoursesId: req.body.CoursesId,
            TopicId: req.body.TopicId,
            userId : req.profile.id,
            VideoUplod:updatedVideoUpload,
            VideoIframe: req.body.VideoIframe,
        }
        let video = await Video.update(data, { where: { id: req.params.videoId },transaction });
        await transaction.commit();
        res.status(200).json({
            video: video,
            success: true,
            message: "Update Successfully Video"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Video"
        });
    }

}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const video = await Video.destroy({ where: { id: req.params.videoId } ,transaction});
        await transaction.commit();
        res.status(200).json({
            video: video,
            success: true,
            message: "Delete Successfully Video"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Video not found'
        });
    }
}


