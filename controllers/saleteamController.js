
const { Op } = require('sequelize');
const { SaleTeam, User, sequelize, Address } = require('../models')
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction()
    try {
        if (req.body.roleId) {
            req.body.telecallerPersonName = "Allotted"
        }
        const saleteam = await SaleTeam.create(req.body, { transaction })

        const addressData = {
            AddressableId: saleteam.id,
            AddressableType: "Lead",
            AddressType: 'Current Address',
            Address: 'Not Address',
            City: 'Not City',
            StateId: 0,
            CountryId: 101,
            DistrictId: 0,
            ...req.body
        };

        const address = await Address.create(addressData, { transaction });

        await SaleTeam.update(
            { AddressableId: address.id },
            { where: { id: saleteam.id }, transaction }
        );

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
        const saleteam = await SaleTeam.findOne({ where: { id: req.params.saleteamId }, order: [['updatedAt', 'DESC']], transaction });
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
        let where = {}
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            where = {
                [Op.or]: [
                    { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                    // Add more fields for searching if needed
                ],
            };
        }


        let conditions2 = { where, order: [['updatedAt', 'DESC']], transaction }
        const obj = {
            page: req.query.page,
            model: SaleTeam,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const saleteam = await paginationfun.pagination(obj)
        await transaction.commit();
        if (saleteam) {
            res.status(200).json({
                saleteam: saleteam,
                success: saleteam.rows.length ? true : false,
                message: saleteam.rows.length ? "Get All Data Success" : "No data Found",

            });
        }
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
        const saleteam = await SaleTeam.update(req.body, { where: { id: req.params.saleteamId }, order: [['updatedAt', 'DESC']], transaction });
        const sale = await SaleTeam.findOne({ where: { id: req.params.saleteamId }, order: [['updatedAt', 'DESC']], transaction });
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

