
const { Questions, Quize, Role, User, CategoriesQuestion, sequelize } = require('../models')

exports.create = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const questions = await Questions.create(req.body);
        return res.status(200).json({
            questions: questions,
            success: true,
            message: "Questions Created Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Questions creation error"
        });
    }
}

exports.findOne = async (req, res) => {
    try {
        const questions = await Questions.findOne({ where: { id: req.params.questionId }, include: [{ model: CategoriesQuestion },{model:Quize}] });
        res.status(200).json({
            questions: questions,
            success: true,
            message: "get one Questions by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Questions'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where = {}
        const questions = await Questions.findAll({
            where, include: [{ model: CategoriesQuestion },{model:Quize}]
        });

        return res.status(200).json({
            questions: questions,
            success: true,
            message: "Get All Questions Data Success"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All Questions Success"
        });
    }
}

exports.update = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const questions = await Questions.update(req.body, { where: { id: req.params.questionId } });
        res.status(200).json({
            questions: questions,
            success: true,
            message: "Update Successfully Questions"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Questions"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const questions = await Questions.destroy({ where: { id: req.params.questionId } });
        res.status(200).json({
            questions: questions,
            success: true,
            message: "Delete Successfully Questions"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Questions not found'
        });
    }
}

