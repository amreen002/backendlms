
const { User, Role } = require('../models')
/* const nodemailer = require("nodemailer"); */
/* const ejs = require("ejs"); */
const path = require("path");
const { Op } = require('sequelize');

require('dotenv').config()
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const secretkey = "token"

/* let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    secure: process.env.SMTP_SERVICE_SECURE,
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASSWORD
    },
    tls: {
        // Uncomment the following line to see more detailed errors
        // secureProtocol: 'TLSv1_2_method', // Force a specific SSL/TLS version if necessary
        rejectUnauthorized: false // This bypasses the certificate check, use it only for debugging
    }
}); */
exports.create = async (req, res) => {

    try {
        let password = req.body.password;
        let roleWiseUsers
        let departmentRoleName = await Role.findOne({ where: { id: req.body.departmentId } })
        if (departmentRoleName.Name == 'Admin' || departmentRoleName.Name == 'Instructor' || departmentRoleName.Name == 'Student' || departmentRoleName.Name == 'Guest/Viewer' || departmentRoleName.Name == 'Sale Department' || departmentRoleName.Name == 'Telecaller Department' || departmentRoleName.Name == 'Front Desk' || departmentRoleName.Name == 'Receptions Desk' || departmentRoleName.Name == 'Counselor Department' || departmentRoleName.Name == 'Account Department') {
            roleWiseUsers = 'Admin';
        } else if (departmentRoleName.Name == 'Telecaller Team') {
            roleWiseUsers = 'Sub Admin';
        }
        let data = {
            name: req.body.name,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: await bcrypt.hash(password, 10),
            departmentId: req.body.departmentId,
            roleName: roleWiseUsers,
            assignToUsers: req.profile.id,
            image: req.file.filename,
            src: req.file.path,
            active: req.body.active
        }

        const users = await User.create(data)

        users.createdAt = null
        users.password = null
        users.updatedAt = null
        return res.status(200).json({
            users: users,
            success: true,
            message: "Users Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Users error"
        })
    }

}





exports.findOne = async (req, res) => {
    try {
        const users = await User.findOne({ where: { id: req.params.usersId }, include: [{ model: Role }] });
        res.status(200).json({
            users: users,
            success: true,
            message: "get one users by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error,
            success: false,
            message: 'error in getting the users'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({ where: { id: loggedInUserId }, include: [{ model: Role }] });

        let where = {};

        if (req.query.LeadGetAllowated) {
            if (loggedInUser.Role.Name == 'Telecaller Department' || loggedInUser.Role.Name == 'Telecaller Team') {
                where = { assignToUsers: loggedInUserId, id: { [Op.ne]: loggedInUserId } };
            }
        } else {
            if (loggedInUser.Role.Name == 'Super Admin') {
                where = where;
            } else {
                where = { assignToUsers: loggedInUserId };
            }
        }


        let userchild = await User.findAll({ where, include: [{ model: Role }] });

        if (req.query.LeadGetAllowated) {
            return res.status(200).json({ users: userchild, success: true, message: "Successfully retrieved all users" });
        } else {
            let allUsers = [loggedInUser, ...userchild];
            return res.status(200).json({ users: allUsers, success: true, message: "Successfully retrieved all users" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error, success: false, message: "Failed to retrieve users" });
    }
};




exports.update = async (req, res) => {
    try {
        let roleWiseUsers
        let departmentRoleName = await Role.findOne({ where: { id: req.body.departmentId } })
        if (departmentRoleName.Name == 'Admin' || departmentRoleName.Name == 'Instructor' || departmentRoleName.Name == 'Student' || departmentRoleName.Name == 'Guest/Viewer' || departmentRoleName.Name == 'Sale Department' || departmentRoleName.Name == 'Telecaller Department' || departmentRoleName.Name == 'Front Desk' || departmentRoleName.Name == 'Receptions Desk' || departmentRoleName.Name == 'Counselor Department' || departmentRoleName.Name == 'Account Department') {
            roleWiseUsers = 'Admin';
        } else if (departmentRoleName.Name == 'Telecaller Team') {
            roleWiseUsers = 'Sub Admin';
        }
        let data = {
            name: req.body.name,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            departmentId: req.body.departmentId,
            roleName: roleWiseUsers,
            assignToUsers: req.profile.id,
            image: req.file.filename,
            src: req.file.path,
            active: req.body.active
        }

        const users = await User.update(data, { where: { id: req.params.usersId } });
        res.status(200).json({
            users: users,
            success: true,
            message: "Update Successfully users"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error,
            success: false,
            message: "error  While Update The users"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const users = await User.destroy({ where: { id: req.params.usersId } });
        res.status(200).json({
            users: users,
            success: true,
            message: "Delete Successfully users"
        });
    } catch (error) {
        res.status(400).json({
            error: error,
            success: false,
            message: 'users not found'
        });
    }
}

exports.rolefindAll = async (req, res) => {
    try {
        const roles = await User.findAll({ where: { roleName: ['Sale Team'] } });
        res.status(200).json({
            roles: roles,
            success: true,
            message: "get Data Successfully Roles"
        });
    } catch (error) {
        res.status(400).json({
            error: error,
            success: false,
            message: 'Roles not found'
        });
    }
}