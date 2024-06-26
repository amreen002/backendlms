
const { Topic ,User ,Courses,Role} = require('../models')
exports.create = async (req, res) => {
    try {
      
        const topic = await Topic.create(req.body)

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
        const topic = await Topic.findOne({ where: { id: req.params.topicId },include: [ { model: Courses }]});
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
        let where={}
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
    try {
        const topic = await Topic.update(req.body, { where: { id: req.params.topicId } });
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Update Successfully Topic"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Topic"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const topic = await TelecallerDepartment.destroy({ where: { id: req.params.topicId } });
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Delete Successfully Topic"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Topic not found'
        });
    }
}


