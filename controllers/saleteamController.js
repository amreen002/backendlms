
const { Op } = require('sequelize');
const { SaleTeam, User } = require('../models')
exports.create = async (req, res) => {
    try {
     /*    req.body.roleId =req.profile.id; */
        const saleteam = await SaleTeam.create(req.body)
        return res.status(200).json({
            saleteam: saleteam,
            success: true,
            message: "Sale Team Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Sale Team  error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const saleteam = await SaleTeam.findOne({ where: { id: req.params.saleteamId } ,order: [['updatedAt', 'DESC']]});
        res.status(200).json({
            saleteam: saleteam,
            success: true,
            message: "get one Sale Team by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Sale Team '
        });
    }
}

exports.findAll = async (req, res) => {
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
  

        let saleteam = await SaleTeam.findAll({order: [['updatedAt', 'DESC']]})
        res.status(200).json({
            saleteam: saleteam,
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
    try {
        const saleteam = await SaleTeam.update(req.body, { where: { id: req.params.saleteamId },order: [['updatedAt', 'DESC']] });
        const sale = await SaleTeam.findOne({ where: { id: req.params.saleteamId },order: [['updatedAt', 'DESC']] });
        res.status(200).json({
            saleteam: sale,
            success: true,
            message: "Update Successfully Sale Team "
        });
    } catch (error) {
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

