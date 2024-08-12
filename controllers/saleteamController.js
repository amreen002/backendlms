
const { Op } = require('sequelize');
const { SaleTeam, User, sequelize, Address, Role, Courses, Multipleinput } = require('../models')
let paginationfun = require("../controllers/paginationController");

exports.createfeild = async (req, res) => {
    try {
        console.log(req.body)
        await Multipleinput.create(req.body)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Sale Team  error"
        })
    }
}
exports.updatefeild = async (req, res) => {
    try {
        console.log( req.body )
        await Multipleinput.update(
             req.body , // Update only the checkedInputs field
             { 
                where: { id: req.params.saleteamId }, // Use the dynamic ID for updating
                order: [['updatedAt', 'DESC']] 
            }
        );
        return res.status(200).json({
            success: true,
            message: "Sale Team fields updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Sale Team error"
        });
    }
};
exports.findAllfeild=async (req, res) => {
    try {
       const checkedInputs = await Multipleinput.findAll();
        return res.status(200).json({
            checkedInputs,
            success: true,
            message: "Sale Team fields updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Sale Team error"
        });
    }
}
exports.findOnefeild = async (req, res) => {
    try {
        const checkedInputs = await Multipleinput.findAll({ where: { id: req.params.saleteamId }, order: [['updatedAt', 'DESC']] });
        res.status(200).json({
            checkedInputs: checkedInputs,
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
        let where;
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            where = {
                [Op.or]: [
                    { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                    // Add more fields for searching if needed
                ],
            };
        }

        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({
            where: { id: loggedInUserId }, attributes: [
                "id",
                "name",
                "userName",
                "phoneNumber",
                "email",
                "assignToUsers",
                "departmentId",
                "teacherId",
                "studentId",
                "roleName",
                "image",
                "src",
                "address",
                "message",
                "active",
            ], include: [{ model: Role }], transaction
        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator" || loggedInUser.Role.Name == "Super Admin")
            where = {}
        else {
            where = { roleId: loggedInUserId }
        }

        let conditions2 = { where, include: [{ model: User, include: [{ model: Role }] }, { model: Address }, { model: Courses }], order: [['updatedAt', 'DESC']], transaction }
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

