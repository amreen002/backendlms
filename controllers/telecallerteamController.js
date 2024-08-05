
const { TelecallerDepartment, SaleTeam, Role, User, sequelize } = require('../models')
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {

        const telecallerdepartment = await TelecallerDepartment.create(req.body, { transaction })
        await transaction.commit();
        return res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Telecaller Team Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Telecaller Team  error"
        })
    }

}

exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const telecallerdepartment = await TelecallerDepartment.findOne({ where: { id: req.params.telecallerteamId }, include: [{ model: User }], transaction })
        await transaction.commit();
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "get one Telecaller Team by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Telecaller Team'
        });
    }
}

exports.findAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let where;
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

        let conditions2 =  { where, include: [{ model: User, include: [{ model: Role }] }],order: [['updatedAt', 'DESC']], transaction }

        const obj = {
            page: req.query.page,
            model: TelecallerDepartment,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const telecallerdepartment = await paginationfun.pagination(obj)
        await transaction.commit();
        if (telecallerdepartment) {
            res.status(200).json({
                telecallerdepartment: telecallerdepartment,
                success: telecallerdepartment.rows.length ? true : false,
                message: telecallerdepartment.rows.length ? "Get All Data Success" : "No data Found",

            });
        }

    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Telecaller Team Data Success"
        });
    }
}

exports.update = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const telecallerdepartment = await TelecallerDepartment.update(req.body, { where: { id: req.params.telecallerteamId }, transaction });
        await transaction.commit();
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Update Successfully Telecaller Team "
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Telecaller Team "
        });
    }

}

exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const telecallerdepartment = await TelecallerDepartment.destroy({ where: { id: req.params.telecallerteamId }, transaction });
        await transaction.commit();
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Delete Successfully Telecaller Department"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Telecaller Department not found'
        });
    }
}


exports.TeamFindAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
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
            ], include: [{ model: Role }],
            transaction

        });
        if (['Super Admin', 'Admin', 'Administrator'].includes(loggedInUser.Role && loggedInUser.Role.Name))
            where = {}
        else {
            where = { roleId: loggedInUserId }
        }
        const department = await SaleTeam.findOne({ where, include: [{ model: User, include: [{ model: Role }] }], transaction });
        if (['Super Admin', 'Admin', 'Administrator'].includes(department.User && department.User.Role && department.User.Role.Name)) {
            where = { telecallerPersonName: "Allotted" }
        } else {
            where = { roleId: department.roleId, telecallerPersonName: "Allotted" }
        }
        if (!department) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Telecaller Department not found"
            });
        }

        const conditions2 = {
            where, include: [{ model: User, include: [{ model: Role }] }],
            order: [['updatedAt', 'DESC']],
            transaction
        }

        const obj = {
            page: req.query.page,
            model: SaleTeam,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const usertelecallerteam = await paginationfun.pagination(obj)
        await transaction.commit();
        if (usertelecallerteam) {
            res.status(200).json({
                usertelecallerteam: usertelecallerteam,
                success: usertelecallerteam.rows.length ? true : false,
                message: usertelecallerteam.rows.length ? "Get All Data Success" : "No data Found",

            });
        }
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve data"
        });
    }
};