
const { Op } = require('sequelize');
const { FrontDesk, User, Role, Address, Courses, Countries, Staties, Cities, sequelize } = require('../models')
let paginationfun = require("../controllers/paginationController");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const crypto = require('crypto');
require('dotenv').config()
const generateEnquiryId = (id) => {
    const prefix = "TGDM";
    const paddedId = id.toString().padStart(3, '0'); // ensures the ID is at least 3 digits
    /*  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // generates a random letter from A to Z */
    const suffix = "A"
    return `${prefix}${paddedId}${suffix}`;
};



exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        // Create the FrontDesk entry
        let frontdesk = await FrontDesk.create(req.body, { transaction });
        const enquiryId = generateEnquiryId(frontdesk.id);
        // Update the FrontDesk entry with the generated enquiryId
        await FrontDesk.update(
            { enquiryId: enquiryId },
            { where: { id: frontdesk.id }, transaction }
        );
        // Set the necessary fields for the Address creation
        req.body.AddressableId = frontdesk.id;
        req.body.AddressableType = "Front Desk";

        // Create the Address entry
        let address = await Address.create(req.body, { transaction });
        await FrontDesk.update(
            { AddressableId: address.id },
            { where: { id: frontdesk.id }, transaction }
        );
        // Commit the transaction
        await transaction.commit();
        await SaleTeam.update(
            {
                name: frontdesk.name,
                username: frontdesk.username,
                lastname: frontdesk.lastname,
                phoneNumber: frontdesk.phoneNumber,
                email: frontdesk.email,
                workingStatus: frontdesk.workingStatus,
                leadPlatform: frontdesk.leadPlatform,
                status: frontdesk.status,
                remark: frontdesk.remark,
                age: frontdesk.age,
                lead_status: frontdesk.lead_status,
                courseId: frontdesk.courseId,
                batchId: frontdesk.batchId,
                AddressableId: frontdesk.AddressableId,
                date:frontdesk.date,
                lead_status:frontdesk.lead_status
            },
            { where: { email: frontdesk.email } }
        );
        await TelecallerDepartment.update(
            {
                name: frontdesk.name,
                username: frontdesk.username,
                lastname: frontdesk.lastname,
                phoneNumber: frontdesk.phoneNumber,
                email: frontdesk.email,
                workingStatus: frontdesk.workingStatus,
                leadPlatform: frontdesk.leadPlatform,
                status: frontdesk.status,
                remark: frontdesk.remark,
                age: frontdesk.age,
                lead_status: frontdesk.lead_status,
                courseId: frontdesk.courseId,
                batchId: frontdesk.batchId,
                AddressableId: frontdesk.AddressableId,
                visitDate:frontdesk.visitDate,
                date:frontdesk.date,
                lead_status:frontdesk.lead_status
            },
            { where: { email: frontdesk.email } }
        );
        res.status(200).json({
            frontdesk: frontdesk,
            address: address,
            success: true,
            message: "Front Desk Created Successfully"
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Error creating Front Desk"
        });
    }
};

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const frontdesk = await FrontDesk.findOne({ where: { id: req.params.frontdeskId }, include: [{ model: User, include: [{ model: Role }] }, { model: Address }, { model: Courses }], order: [['updatedAt', 'DESC']] ,transaction});
        await transaction.commit(); 
        res.status(200).json({
            frontdesk: frontdesk,
            success: true,
            message: "get one Front Desk by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Front Desk'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where;
        const search = req.query.search;
        if (search) {
            where = {
                [Op.or]: [
                    { enquiryId: { [Op.substring]: `%${search}%` } }, // Using 'like' operator for partial matching
                    // Add more fields for searching if needed
                ],
            };
        }

        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({ where: { id: loggedInUserId }, attributes: [
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
        ], include: [{ model: Role }] ,transaction});
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator"||loggedInUser.Role.Name == "Super Admin") 
            where = {}  
        else {
            where = { roleId: loggedInUserId }
        }

        let conditions2 = { where, include: [{ model: User, include: [{ model: Role }] }, { model: Address }, { model: Courses }], order: [['updatedAt', 'DESC']] ,transaction}
        
        const obj = {
            page: req.query.page,
            model: FrontDesk,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const frontdesk = await paginationfun.pagination(obj)
        await transaction.commit();
        if (frontdesk) {
            res.status(200).json({
                frontdesk: frontdesk,
                success: frontdesk.rows.length ? true : false,
                message: frontdesk.rows.length ? "Get All Data Success" : "No data Found",

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
    const transaction = await sequelize.transaction();
    try {
        // Update the FrontDesk entry
        let frontdesk = await FrontDesk.update(req.body, { where: { id: req.params.frontdeskId }, transaction });

        // Find the associated address
        const address = await Address.findOne({ where: { AddressableId: req.params.frontdeskId }, transaction });

        if (!address) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Re-fetch the updated FrontDesk entry
        frontdesk = await FrontDesk.findOne({ where: { id: req.params.frontdeskId }, transaction });
        if (!frontdesk) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "FrontDesk not found"
            });
        }

        // Set the required fields for updating the Address entry
        req.body.AddressableId = frontdesk.id;
        req.body.AddressableType = "Front Desk";

        // Update the Address entry
        await Address.update(req.body, { where: { id: address.id }, transaction });

        // Retrieve the updated Address entry
        const updatedAddress = await Address.findOne({ where: { id: address.id }, transaction });

        // Commit the transaction
        await transaction.commit();

        // Respond with the updated FrontDesk and Address details
        res.status(200).json({
            frontdesk: frontdesk,
            address: updatedAddress,
            success: true,
            message: "Successfully updated Front Desk and Address"
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(error);
        res.status(500).json({
            error: error.message,
            success: false,
            message: "Error while updating the Front Desk"
        });
    }
};


exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const frontdesk = await FrontDesk.destroy({ where: { id: req.params.frontdeskId } ,transaction});
        await transaction.commit();

        res.status(200).json({
            frontdesk: frontdesk,
            success: true,
            message: "Delete Successfully Front Desk"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Front Desk  not found'
        });
    }
}

exports.country = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let country = await Countries.findAll({ include: [{ model: Staties, include: [{ model: Cities }] }] ,transaction});
        await transaction.commit();
        res.status(200).json({
            country: country,
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


exports.state = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let state = await Staties.findAll({  include: [{ model: Cities }]  ,transaction});
        await transaction.commit();
        res.status(200).json({
            state: state,
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

exports.city = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let city = await Cities.findAll({transaction});
        await transaction.commit();
        res.status(200).json({
            city: city,
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