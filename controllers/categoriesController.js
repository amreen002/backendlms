
const { Categories,Role ,User,sequelize} = require('../models')
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;
        const categories = await Categories.create(req.body,{transaction})
        await transaction.commit();
        return res.status(200).json({
            categories: categories,
            success: true,
            message: "Categories Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Categories error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const categories = await Categories.findOne({ where: { id: req.params.categoriesId},include: [{ model: User }] ,transaction});
        await transaction.commit();
        res.status(200).json({
            categories: categories,
            success: true,
            message: "get one Categories by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Categories'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where={ }
        let categories = await Categories.findAll({where,include: [{ model: User,include: [{ model: Role }] }],transaction});
        await transaction.commit();
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Get All Categories Data Success"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Categories Data Success"
        });
    }
}

exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;
        const categories = await Categories.update(req.body, { where: { id: req.params.categoriesId },transaction });
        await transaction.commit();
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Update Successfully Categories"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Categories"
        });
    }

}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const categories = await Categories.destroy({ where: { id: req.params.categoriesId },transaction });
        await transaction.commit();
        res.status(200).json({
            categories: categories,
            success: true,
            message: "Delete Successfully Categories"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Categories not found'
        });
    }
}

