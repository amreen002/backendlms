
const {TelecallerDepartment, Topic ,User ,Courses,Role,sequelize} = require('../models')
exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        req.body.userId=req.profile.id
        const topic = await Topic.create(req.body,{transaction})
        await transaction.commit();
        return res.status(200).json({
            topic: topic,
            success: true,
            message: "Topic Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Topic  error"
        })
    }

}

exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const topic = await Topic.findOne({ where: { id: req.params.topicId},include: [ { model: Courses }],transaction});
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "get one Topic by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Topic'
        });
    }
}

exports.findAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
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
            ], include: [{ model: Role }],
            transaction

        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator")
            where = {}
        else {
            where = { roleId: loggedInUserId }
        }
        let topic = await Topic.findAll({where ,include: [ { model: Courses }],transaction});
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Get All Topic Data Success"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Topic Data Success"
        });
    }
}

exports.update = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        req.body.userId=req.profile.id
        const topic = await Topic.update(req.body, { where: { id: req.params.topicId },transaction });
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Update Successfully Topic"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Topic"
        });
    }

}

exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const topic = await Topic.destroy({ where: { id: req.params.topicId },transaction });
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Delete Successfully Topic"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Topic not found'
        });
    }
}


