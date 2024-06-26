
const { Op, QueryTypes } = require("sequelize");
const { parse } = require("dotenv");
const { Role, User, UserPermissionRoles } = require('../models')
exports.create = async (req, res) => {
    try {

        let role = await Role.create(req.body);
        let permissions = [];
        let permission;
        req.body.permission = req.body.permission
        if (req.body.permission?.length) {
            for (let i = 0; i < req.body.permission?.length; i++) {
                req.body.permission[i].RoleId = role.id;
                req.body.permission[i].UserId = req.profile.id;
                permission = await UserPermissionRoles.create(req.body.permission[i]);
                permissions.push(permission);
            };
        }
        /*       else {
                   req.body.permission.RoleId = role.id;
                   req.body.permission.UserId = req.profile.id;
                   await UserPermissionRoles.create(req.body.permission);
      
      
              } */

        return res.status(200).json({
            success: true,
            message: "Role with Permission created successfully.",
            role: role,
            permission: permissions,
            success: true,
            message: "Role Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Role  error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const role = await Role.findOne({ where: { id: req.params.roleId },include: [  { model: UserPermissionRoles }] });
        res.status(200).json({
            role: role,
            success: true,
            message: "get one Role by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Role'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        /*         if (searchTerm) {
                    where = {
                        [Op.or]: [
                            { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                            // Add more fields for searching if needed
                        ],
                    };
                } */


        let role = await Role.findAll({include: [  { model: UserPermissionRoles }]})
        res.status(200).json({
            role: role,
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
        const role = await Role.update(req.body, { where: { id: req.params.roleId } });
        let permissions = [];
        let permission;
        req.body.permission = req.body.permission
        if (req.body.permission.length > 0) {
            for (let i = 0; i < req.body.permission.length; i++) {
                req.body.permission[i].RoleId = role.id;
                req.body.permission[i].UserId = req.profile.id;
                permission = await UserPermissionRoles.update(req.body.permission[i], {
                    where: {
                        RoleId: req.params.roleId
                    }
                });
                permissions.push(permission);
            }
        }

   
 
        res.status(200).json({
            role: role,
            permission: permission,
            success: true,
            message: "Update Successfully Role"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Role"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const role = await Role.destroy({ where: { id: req.params.roleId } });
        res.status(200).json({
            role: role,
            success: true,
            message: "Delete Successfully Role"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Role  not found'
        });
    }
}

