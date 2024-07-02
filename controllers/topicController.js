
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
        return res.status(500).json({
            error: error,
            success: false,
            message: "Topic  error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const topic = await Topic.findOne({ where: { id: req.params.topicId},include: [ { model: Courses }]});
        res.status(200).json({
            topic: topic,
            success: true,
            message: "get one Topic by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Topic'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where={userId:req.profile.id}
        let topic = await Topic.findAll({where ,include: [ { model: Courses }]});
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Get All Topic Data Success"
        });
    } catch (error) {
        console.log(error)
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
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Topic"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const topic = await Topic.destroy({ where: { id: req.params.topicId } });
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Delete Successfully Topic"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'Topic not found'
        });
    }
}


