
const { Op } = require('sequelize');
const { SaleTeam, User ,sequelize } = require('../models')
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction()
    try {
     /*    req.body.roleId =req.profile.id; */

        const saleteam = await SaleTeam.create(req.body,{transaction})
        await transaction.commit();
        return res.status(200).json({
            saleteam: saleteam,
            success: true,
            message: "Sale Team Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Sale Team  error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction()
    try {
        const saleteam = await SaleTeam.findOne({ where: { id: req.params.saleteamId } ,order: [['updatedAt', 'DESC']],transaction});
        await transaction.commit();
        res.status(200).json({
            saleteam: saleteam,
            success: true,
            message: "get one Sale Team by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Sale Team '
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction()
    try {
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            where = {
                [Op.or]: [
                    { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                    // Add more fields for searching if needed
                ],
            };
        }
  

        let saleteam = await SaleTeam.findAll({order: [['updatedAt', 'DESC']],transaction});
        await transaction.commit();
        res.status(200).json({
            saleteam: saleteam,
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
    let transaction = await sequelize.transaction()
    try {
        const saleteam = await SaleTeam.update(req.body, { where: { id: req.params.saleteamId },order: [['updatedAt', 'DESC']] ,transaction});
        const sale = await SaleTeam.findOne({ where: { id: req.params.saleteamId },order: [['updatedAt', 'DESC']],transaction });
        await transaction.commit();
        res.status(200).json({
            saleteam: sale,
            success: true,
            message: "Update Successfully Sale Team "
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Sale Team "
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const saleteam = await SaleTeam.destroy({ where: { id: req.params.saleteamId } });
        res.status(200).json({
            saleteam: saleteam,
            success: true,
            message: "Delete Successfully Sale Team "
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Sale Team  not found'
        });
    }
}

