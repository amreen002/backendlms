const { TelecallerDepartment, SaleTeam, Role, User, sequelize } = require('../models')

const { generateOTP, sendOTPViaEmail, sendOTPViaSMS,sendOTPViaWhatsApp } = require('./otpUtils');
let paginationfun = require("../controllers/paginationController");
let otpStore = {}; // Store OTP in memory with expiration time

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // Create a new TelecallerDepartment
        const telecallerdepartment = await TelecallerDepartment.create(req.body, { transaction });
        // Generate OTP
        const otp = generateOTP();
        // Send OTP via email and SMS
        sendOTPViaEmail(otp, req.body.email);
        sendOTPViaSMS(otp, req.body.phoneNumber);
        sendOTPViaWhatsApp(otp,  req.body.phoneNumber);
        // Update SaleTeam
        await SaleTeam.update(
            {
                name: telecallerdepartment.name,
                lastname: telecallerdepartment.lastname,
                phoneNumber: telecallerdepartment.phoneNumber,
                email: telecallerdepartment.email,
                workingStatus: telecallerdepartment.workingStatus,
                leadPlatform: telecallerdepartment.leadPlatform,
                status: telecallerdepartment.status,
                remark: telecallerdepartment.remark,
            },
            { where: { email: telecallerdepartment.email } }
        );

        await transaction.commit();
        return res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Telecaller Team Created Successfully"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error.message || "Internal Server Error",
            success: false,
            message: "Telecaller Team creation error"
        });
    }
};

exports.sendOtp = async (req, res) => {
    const { phoneNumber, email } = req.body;
    const otp = generateOTP();
    // Send OTP via SMS if phone number is provided
    if (phoneNumber) {
        sendOTPViaSMS(otp, phoneNumber);
        sendOTPViaWhatsApp(otp, phoneNumber);
    }
    // Send OTP via Email if email is provided
    if (email) {
        sendOTPViaEmail(otp, email);
    }
    const expiry = Date.now() + 5 * 60 * 1000; // OTP expiry time, e.g., 5 minutes
    // Store OTP with expiry time
    if (phoneNumber) {
        otpStore[phoneNumber] = { otp, expiry };
    }
    if (email) {
        otpStore[email] = { otp, expiry };
    }
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
};


// In your backend file
exports.verifyOtp = async (req, res) => {
    const { otp, phoneNumber, email } = req.body;
    let otpData;
    if (phoneNumber) {
        otpData = otpStore[phoneNumber];
    } else if (email) {
        otpData = otpStore[email];
    } else {
        return res.status(400).json({ success: false, message: 'Phone number or email is required' });
    }

    if (otpData && otpData.otp === otp && Date.now() < otpData.expiry) {
        delete otpStore[phoneNumber || email]; // Remove OTP after successful verification
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
};


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

        let conditions2 = { where, include: [{ model: User, include: [{ model: Role }] }], order: [['updatedAt', 'DESC']], transaction }

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
