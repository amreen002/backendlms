
const { Categories,Role ,User} = require('../models')
exports.create = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const categories = await Categories.create(req.body)

        return res.status(200).json({
            categories: categories,
            success: true,
            message: "Categories Created SuccessFully"
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
        const categories = await Categories.findOne({ where: { id: req.params.categoriesId },include: [{ model: User }] });
        res.status(200).json({
            categories: categories,
            success: true,
            message: "get one Categories by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Categories'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where={}
        let categories = await Categories.findAll({where,include: [{ model: User,include: [{ model: Role }] }]});
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Get All Categories Data Success"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Categories Data Success"
        });
    }
}

exports.update = async (req, res) => {
    try {
        req.body.userId = req.profile.id;
        const categories = await Categories.update(req.body, { where: { id: req.params.categoriesId } });
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Update Successfully Categories"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Categories"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const categories = await Categories.destroy({ where: { id: req.params.categoriesId } });
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Delete Successfully Categories"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Categories not found'
        });
    }
}

