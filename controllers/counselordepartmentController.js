
const { Op } = require('sequelize');
const { CouselingDepartment, FrontDesk, User, Role, Address, Courses,Countries, Staties, Cities, sequelize } = require('../models')

exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
     /*    req.body.roleId =req.profile.id; */
        const counselordepartment = await CouselingDepartment.create(req.body,{transaction})
        await transaction.commit();
        return res.status(200).json({
            counselordepartment: counselordepartment,
            success: true,
            message: "Counselor Department Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Counselor Department  error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const counselordepartment = await CouselingDepartment.findOne({ where: { id: req.params.counselordepartmentId } ,include: [{ model: User, include: [{ model: Role }] }, { model: Address },{ model: Courses }],order: [['updatedAt', 'DESC']],transaction});
        await transaction.commit(); 
        res.status(200).json({
            counselordepartment: counselordepartment,
            success: true,
            message: "get one Counselor Department by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Counselor Department'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where={}
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            where = {
                [Op.or]: [
                    { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                    // Add more fields for searching if needed
                ],
            };
        }
  

        let counselordepartment = await CouselingDepartment.findAll({where, include: [{ model: User, include: [{ model: Role }] }, { model: Address },{ model: Courses }], order: [['updatedAt', 'DESC']],transaction })
        await transaction.commit(); 
        res.status(200).json({
            counselordepartment: counselordepartment,
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
    let transaction = await sequelize.transaction();
    try {
        const counselordepartment = await CouselingDepartment.update(req.body, { where: { id: req.params.counselordepartmentId },order: [['updatedAt', 'DESC']] },transaction);
        await transaction.commit(); 
        res.status(200).json({
            counselordepartment: counselordepartment,
            success: true,
            message: "Update Successfully Counselor Department"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Counselor Department"
        });
    }

}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const counselordepartment = await CouselingDepartment.destroy({ where: { id: req.params.counselordepartmentId },transaction });
        await transaction.commit(); 
        res.status(200).json({
            counselordepartment: counselordepartment,
            success: true,
            message: "Delete Successfully Counselor Department"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Counselor Department  not found'
        });
    }
}

