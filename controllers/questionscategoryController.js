
const { CategoriesQuestion,Role ,User} = require('../models')
exports.create = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const questionscategory = await CategoriesQuestion.create(req.body)

        return res.status(200).json({
            questionscategory: questionscategory,
            success: true,
            message: "Categories Question Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Categories error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const questionscategory = await CategoriesQuestion.findOne({ where: { id: req.params.questionscategoryId }});
        res.status(200).json({
            questionscategory: questionscategory,
            success: true,
            message: "get one Categories Question by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Categories Question'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where={}
        let questionscategory = await CategoriesQuestion.findAll({where});
        res.status(200).json({
            questionscategory: questionscategory,
            success: true,
            message: "Get All Categories Question Data Success"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Categories Question Data Success"
        });
    }
}

exports.update = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const questionscategory = await CategoriesQuestion.update(req.body, { where: { id: req.params.questionscategoryId } });
        res.status(200).json({
            questionscategory: questionscategory,
            success: true,
            message: "Update Successfully Categories Question"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Categories Question"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const questionscategory = await CategoriesQuestion.destroy({ where: { id: req.params.questionscategoryId } });
        res.status(200).json({
            questionscategory: questionscategory,
            success: true,
            message: "Delete Successfully Categories Question"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Categories Question not found'
        });
    }
}

