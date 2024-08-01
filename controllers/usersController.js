
const { User, Role, Teacher, Student, Address, sequelize } = require('../models')
/* const nodemailer = require("nodemailer"); */
/* const ejs = require("ejs"); */
const path = require("path");
const { Op } = require('sequelize');

require('dotenv').config()
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const secretkey = process.env.SESSION_SECRET || 'technogazwersecret'
let paginationfun = require("../controllers/paginationController");

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
    const transaction = await sequelize.transaction();
    try {
        let password = req.body.password;
        let roleWiseUsers
        let updateusers;


        const departmentRole = await Role.findOne({ where: { id: req.body.departmentId }, transaction });
        if (!departmentRole) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Department role not found' });
        }
        let useremail = await User.findOne({where:{email:req.body.email},transaction})
        if (useremail) {
            await transaction.rollback();
            return res.status(404).json({ message:  "The email address you entered is already associated with an account. Please use a different email or log in with your existing account."});
        }

        if (['Admin', 'Instructor', 'Administrator', 'Student', 'Guest/Viewer', 'Sale Department', 'Telecaller Department', 'Front Desk', 'Receptions Desk', 'Counselor Department', 'Account Department','Super Admin'].includes(departmentRole.Name)) {
            roleWiseUsers = 'Admin';
        } else if (departmentRole.Name === 'Telecaller Team') {
            roleWiseUsers = 'Sub Admin';
        } else {
            roleWiseUsers = 'User';
        }
        /* Users create */
        let data = {
            name: req.body.name,
            lastname: req.body.lastname,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: await bcrypt.hash(password, 10),
            departmentId: req.body.departmentId,
            roleName: roleWiseUsers,
            assignToUsers: req.profile.id,
            image: req.file ? req.file.filename : null,
            src: req.file ? req.file.path : null,
            active: req.body.active,
            teacherId:req.body.teacherId,
            studentId:req.body.studentId,
        }

        const users = await User.create(data, transaction)
        /*==========================*/

        // Create the Address entry
        req.body.AddressableId = users.id;
        req.body.AddressableType = "Users";
        const address = await Address.create(req.body, { transaction });
        /*==========================*/


        /*Update the Users entry*/
        await User.update({ AddressableId: address.id }, { where: { id: users.id }, transaction });
        updateusers = await User.findOne({ where: { id: users.id }, transaction });
        /*==========================*/

        /*Create the Teacher entry*/
        if (updateusers.departmentId == 3) {
            const teacherData = {
                Name: users.name,
                Email: users.email,
                Password: users.password,
                TeacherType: "Online",
                Username: users.userName,
                PhoneNumber: users.phoneNumber,
                roleId: req.profile.id,
                AddressableId: address.id,
                DOB: req.body.DOB,
                TeacherType: req.body.TeacherType,
                YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
                image:users.image,
                CousesId:req.body.CousesId,
                LastName: users.LastName,
            };
            const teacher = await Teacher.create(teacherData, { transaction });
            await User.update({ teacherId: teacher.id }, { where: { id: users.id }, transaction });
        }
        /*==========================*/


        /*Create the Student entry*/
        if (updateusers.departmentId == 4) {
            const studentData = {
                Name: users.name,
                Email: users.email,
                Password: users.password,
                Username: users.userName,
                PhoneNumber: users.phoneNumber,
                roleId: req.profile.id,
                AddressableId: address.id,
                CoursesId: req.body.CoursesId,
                Date: req.body.Date,
                BatchId: req.body.BatchId,
                image:users.image,
                LastName: users.LastName,
               
            };
            const students = await Student.create(studentData, { transaction });
            await User.update({ studentId: students.id }, { where: { id: users.id }, transaction });
        }

        /*==========================*/
        if (updateusers.departmentId === 5) {
            if (updateusers.studentId === 4) {
                const studentData = {
                    Name: users.name,
                    Email: users.email,
                    Password: users.password,
                    Username: users.userName,
                    PhoneNumber: users.phoneNumber,
                    roleId: req.profile.id,
                    AddressableId: address.id,
                    CoursesId: req.body.CoursesId,
                    Date: req.body.Date,
                    BatchId: req.body.BatchId,
                    image:users.image,
                    LastName: users.LastName,
                };
                const students = await Student.create(studentData, { transaction });
                await User.update({ studentId: students.id }, { where: { id: users.id }, transaction });
            }
            if (updateusers.teacherId === 3) {
                const teacherData = {
                    Name: users.name,
                    Email: users.email,
                    Password: users.password,
                    TeacherType: "Online",
                    Username: users.userName,
                    PhoneNumber: users.phoneNumber,
                    roleId: req.profile.id,
                    AddressableId: address.id,
                    DOB: req.body.DOB,
                    TeacherType: req.body.TeacherType,
                    YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
                    image:users.image,
                    CousesId:req.body.CousesId,
                    LastName: users.LastName,
                };
                const teacher = await Teacher.create(teacherData, { transaction });
                await User.update({ teacherId: teacher.id }, { where: { id: users.id }, transaction });
            }
        }
        users.createdAt = null
        users.password = null
        users.updatedAt = null
        await transaction.commit();
        return res.status(200).json({
            users: updateusers,
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
    const transaction = await sequelize.transaction();
    let Teachers;
    let Students;

    try {
        // Fetch the user with included related models
        const user = await User.findOne({
            where: { id: req.params.usersId },
            attributes: [
                "id",
                "name",
                "lastname",
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
                "createdAt",
            ],
            include: [{ model: Role }, { model: Address }],
            transaction
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch related student and teacher records
        if (user.studentId) {
            Students = await Student.findOne({
                where: { id: user.studentId },
                transaction
            });
        }

        if (user.teacherId) {
            Teachers = await Teacher.findOne({
                where: { id: user.teacherId },
                transaction
            });
        }

        // Add related records to the user object if they exist
        if (Teachers) {
            user.dataValues.Teachers = [Teachers];
        }
        if (Students) {
            user.dataValues.Students = [Students];
        }

        await transaction.commit();

        res.status(200).json({
            users: user,
            success: true,
            message: "Fetched user by ID successfully"
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({
            error: error,
            success: false,
            message: "Error in fetching the user"
        });
    }
};

exports.findAll = async (req, res) => {
    try {

        let subQuery = false

        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({
            where: { id: loggedInUserId }, attributes: [
                "id",
                "name",
                "lastname",
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
            ], include: [{ model: Role }, { model: Address }, { model: Teacher }, { model: Student }]
        });

        let where = {};

        if (req.query.LeadGetAllowated) {
            if (loggedInUser.Role.Name == 'Telecaller Department' || loggedInUser.Role.Name == 'Telecaller Team'||loggedInUser.Role.Name == 'Super Admin') {
                where = { assignToUsers: loggedInUserId, id: { [Op.ne]: loggedInUserId } };
            }
        } else {
            if (loggedInUser.Role.Name == 'Super Admin' || loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator") {
                where = where;
            } else {
                where = { assignToUsers: loggedInUserId };
            }
        }

        let conditions2 = {
            where,
            where, attributes: [
                "id",
                "name",
                "lastname",
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
                "createdAt",
            ], include: [{ model: Role }, { model: Address }],
            order: [['updatedAt', 'DESC']],
            subQuery: subQuery
        }
        const obj = {
            page: req.query.page,
            model: User,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        await sequelize.query("SET SESSION sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));");


        const userchild = await paginationfun.pagination(obj)
        if (userchild) {
            if (req.query.LeadGetAllowated) {
                return res.status(200).json({
                    success: userchild.rows.length ? true : false,
                    message: userchild.rows.length ? "Successfully retrieved all users" : "No data Found",
                    users: userchild
                });
            } else {
                if (userchild && Array.isArray(userchild.rows)) {
               
                    const obj = {
                        page: req.query.page,
                        model: User,
                        headers: req.headers.host,
                        split: req.url.split("?")[0],
                        condtion: conditions2,
                        whereData: where
                    }
                    const allUserdata = await paginationfun.pagination(obj)
                   
                    return res.status(200).json({
                        users:[loggedInUser, ...allUserdata.rows] , success: allUserdata.rows.length ? true :false,
                        message: allUserdata.rows.length ? "Successfully retrieved all users" : "No data Found",
                    });
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error, success: false, message: "Failed to retrieve users" });
    }
};




exports.update = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let roleWiseUsers;
        const existingUser = await User.findOne({ where: { id: req.params.usersId }, transaction });
        if (!existingUser) {
            return res.status(404).json({ message: 'Existing profile not found' });
        }
        const useremail = await User.findOne({ where: { email: req.body.email, id: { [Op.ne]: req.params.usersId } }, transaction });
        if (useremail) {
            await transaction.rollback();
            return res.status(400).json({ // Corrected the status code to 400 for a validation error
                success: false,
                message: "The email address you entered is already associated with an account. Please use a different email or log in with your existing account."
            });
        }

        const departmentRole = await Role.findOne({ where: { id: req.body.departmentId }, transaction });
        if (!departmentRole) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Department role not found' });
        }

        if (['Admin', 'Instructor', 'Administrator', 'Student', 'Guest/Viewer', 'Sale Department', 'Telecaller Department', 'Front Desk', 'Receptions Desk', 'Counselor Department', 'Account Department','Super Admin'].includes(departmentRole.Name)) {
            roleWiseUsers = 'Admin';
        } else if (departmentRole.Name === 'Telecaller Team') {
            roleWiseUsers = 'Sub Admin';
        } else {
            roleWiseUsers = 'User';
        }

        const data = {
            name: req.body.name,
            lastname:req.body.lastname,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            departmentId: req.body.departmentId,
            roleName: roleWiseUsers,
            assignToUsers: req.profile.id,
            image: req.file ? req.file.filename : existingUser.image,
            src: req.file ? req.file.path : existingUser.src,
            active: req.body.active,
        };

        await User.update(data, { where: { id: req.params.usersId }, transaction });

        let address = await Address.findOne({ where: { AddressableId: req.params.usersId }, transaction });

        if (!address) {
            req.body.AddressableId = existingUser.id;
            req.body.AddressableType = 'Users';
            address = await Address.create(req.body, { transaction });
            await User.update({ AddressableId: address.id }, { where: { id: existingUser.id }, transaction });
        } else if (existingUser.AddressableId === null) {
            req.body.AddressableId = existingUser.id;
            req.body.AddressableType = 'Users';
            address = await Address.create(req.body, { transaction });
            await User.update({ AddressableId: address.id }, { where: { id: existingUser.id }, transaction });
        }
        else {
            req.body.AddressableId = existingUser.id;
            req.body.AddressableType = 'Update Users';
            await Address.update(req.body, { where: { id: address.id }, transaction });
        }

        const updatedUser = await User.findOne({ where: { id: req.params.usersId }, transaction });
        if (!updatedUser) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found after update' });
        }

        if (updatedUser.departmentId == 3) {
            const teacherData = {
                Name: updatedUser.name,
                Email: updatedUser.email,
                TeacherType: 'Online',
                Username: updatedUser.userName,
                PhoneNumber: updatedUser.phoneNumber,
                AddressableId: updatedUser.AddressableId,
                DOB: req.body.DOB,
                TeacherType: req.body.TeacherType,
                YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
                image:updatedUser.image,
                CousesId:req.body.CousesId,
                LastName: updatedUser.LastName,
            };

            const teacher = await Teacher.update(teacherData, { where: { id: updatedUser.teacherId }, order: [['updatedAt', 'DESC']], transaction });
            await User.update({ teacherId: teacher.id }, { where: { id: updatedUser.id }, transaction });
        }

        if (updatedUser.departmentId == 4) {
            const studentData = {
                Name: updatedUser.name,
                Email: updatedUser.email,
                Password: updatedUser.password,
                Username: updatedUser.userName,
                PhoneNumber: updatedUser.phoneNumber,
                AddressableId: updatedUser.AddressableId,
                CoursesId: req.body.CoursesId,
                Date: req.body.Date,
                BatchId: req.body.BatchId,
                image:updatedUser.image,
                LastName: updatedUser.LastName,
            };
            const student = await Student.update(studentData, { where: { id: updatedUser.studentId }, order: [['updatedAt', 'DESC']], transaction });
            await User.update({ studentId: student.id }, { where: { id: updatedUser.id }, transaction });
        }
        if (updatedUser.departmentId == 5) {
            if (updatedUser.studentId) {
                const studentData = {
                    Name: updatedUser.name,
                    Email: updatedUser.email,
                    Password: updatedUser.password,
                    Username: updatedUser.userName,
                    PhoneNumber: updatedUser.phoneNumber,
                    roleId: updatedUser.id,
                    AddressableId: updatedUser.AddressableId,
                    CoursesId:req.body.CoursesId,
                    Date:req.body.Date,
                    BatchId:req.body.BatchId,
                    image:updatedUser.image,
                    LastName: updatedUser.LastName,
                  };
                  const student = await Student.update(studentData, { where: { id:updatedUser.studentId }, order: [['updatedAt', 'DESC']], transaction });
                  await User.update({ studentId: student.id }, { where: { id: updatedUser.id }, transaction });
            }
            if (updatedUser.teacherId) {
                const teacherData = {
                    Name: updatedUser.name,
                    Email: updatedUser.email,
                    TeacherType: 'Online',
                    Username: updatedUser.userName,
                    PhoneNumber: updatedUser.phoneNumber,
                    roleId: updatedUser.id,
                    AddressableId: updatedUser.AddressableId,
                    DOB:req.body.DOB,
                    TeacherType:req.body.TeacherType,
                    YourIntroducationAndSkills:req.body.YourIntroducationAndSkills,
                    image:updatedUser.image,
                    CousesId:req.body.CousesId,
                    LastName: updatedUser.LastName,
                  };
                  const teacher = await Teacher.update(teacherData, { where: { id:updatedUser.teacherId }, order: [['updatedAt', 'DESC']], transaction });
                  await User.update({ teacherId: teacher.id }, { where: { id: updatedUser.id }, transaction });
            }
        }

        await transaction.commit();
        res.status(200).json({
            users: updatedUser,
            success: true,
            message: 'Update successful',
        });
    } catch (error) {
        console.error('Error while updating user:', error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Error while updating the user',
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const users = await User.destroy({ where: { id: req.params.usersId } });
        res.status(200).json({
            users: users,
            success: true,
            message: "Delete Successfully users"
        });
    } catch (error) {
        res.status(500).json({
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
        res.status(500).json({
            error: error,
            success: false,
            message: 'Roles not found'
        });
    }
}