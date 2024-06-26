
const { Op } = require('sequelize');
const { Role, UserPermissionRoles } = require('../models')
exports.create = async (req, res) => {
    try {

        let userPermission = [];
        if (req.body.userPermission) {
            for (let i = 0; i < req.body.userPermission.length; i++) {
                let userpermissiondetails = {
                    UserId: req.profile.id,
                    Create: req.body.userPermission[i].Create,
                    Read: req.body.userPermission[i].Read,
                    Update: req.body.userPermission[i].Update,
                    Delete: req.body.userPermission[i].Delete,
                  /*   fullAccess: req.body.userPermission[i].fullAccess, */
                }
                let accessUserPermissions = await UserPermissionRoles.create(userpermissiondetails);
                userPermission.push(accessUserPermissions);
            }
        }

        return res.status(200).json({
            accessUserPermissions: accessUserPermissions,
            success: true,
            message: "User Permission Department Created Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Failed to create user permission department"
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const userpermission = await UserPermissionRoles.findOne({ where: { id: req.params.roleId } });
        res.status(200).json({
            userpermission: userpermission,
            success: true,
            message: "get one User Permission Department by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error,
            success: false,
            message: 'error in getting the User Permission Department'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let userpermission = await UserPermissionRoles.findAll({include: [  { model: Role }]})
        res.status(200).json({
            userpermission: userpermission,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};

exports.update = async (req, res) => {
    try {
        const userpermission = await UserPermissionRoles.update(req.body, { where: { id: req.params.userpermissionId } });
        res.status(200).json({
            userpermission: userpermission,
            success: true,
            message: "Update Successfully User Permission Department"
        });
    } catch (error) {
        res.status(400).json({
            error: error,
            success: false,
            message: "error  While Update The User Permission Department"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const userpermission = await UserPermissionRoles.destroy({ where: { id: req.params.userpermissionId } });
        res.status(200).json({
            userpermission: userpermission,
            success: true,
            message: "Delete Successfully User Permission Department"
        });
    } catch (error) {
        res.status(400).json({
            error: error,
            success: false,
            message: 'User Permission Department  not found'
        });
    }
}

