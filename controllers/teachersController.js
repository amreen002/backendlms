
const path = require('path');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { Teacher, User, Role, Address, sequelize,Courses } = require('../models'); // Adjust the path as necessary
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    const { Password, Name, LastName, AddressableId, Email, DOB, TeacherType, Username, PhoneNumber, YourIntroducationAndSkills,CousesId } = req.body;
    const image =req.file? req.file.filename :null
    try {
      
        if (!Password) {
            throw new Error('Password is required');
        }
        let useremail = await Teacher.findOne({where:{Email:req.body.Email},transaction})
        if (useremail) {
            await transaction.rollback();
            return res.status(404).json({ message:"The email address you entered is already associated with an account. Please use a different email or log in with your existing account." });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);

        const teacherData = {
            Name,
            LastName,
            AddressableId,
            Email,
            Password: hashedPassword,
            DOB,
            TeacherType,
            Username,
            PhoneNumber,
            roleId: req.profile.id,
            YourIntroducationAndSkills,
            CousesId,
            image
        };

        let teachers = await Teacher.create(teacherData, { transaction });

        const addressData = {
            AddressableId: teachers.id,
            AddressableType: "Instructor",
            ...req.body
        };

        const address = await Address.create(addressData, { transaction });

        await Teacher.update(
            { AddressableId: address.id },
            { where: { id: teachers.id }, transaction }
        );

        const updatedTeacher = await Teacher.findOne({ where: { id: teachers.id }, transaction });

        const userData = {
            teacherId: teachers.id,
            name: teachers.Name,
            userName: teachers.Username,
            phoneNumber: teachers.PhoneNumber,
            email: teachers.Email,
            password: teachers.Password,
            assignToUsers: req.profile.id,
            departmentId: 3,
            roleName: "Admin",
            AddressableId: address.id,
            image: teachers.image,
            src: req.file ? req.file.path : null,
            lastname: teachers.LastName,
        };

        const user = await User.create(userData, { transaction });

        await transaction.commit();

        return res.status(200).json({
            teachers: updatedTeacher,
            address: address,
            user: user,
            success: true,
            message: "Teacher created successfully"
        });

    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Error creating teacher"
        });
    }
};


exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // Fetch teacher along with related models
        const teachers = await Teacher.findOne({
            where: { id: req.params.teachersId },
            attributes: { exclude: ['Password'] },
            include: [
                {
                    model: User,
                    attributes: { exclude: ['password', 'expireToken', 'resentPassword', 'passwordResetOtp'] },
                    include: [{ model: Role }]
                },
                { model: Address }
            ],
            order: [['updatedAt', 'DESC']],
            transaction
        });

        // If teacher is found and CousesId exists
        if (teachers && teachers.CousesId) {
            const courseIds = teachers.CousesId.split(',').map(id => parseInt(id, 10)); // Convert to an array of integers

            // Fetch courses based on the course IDs
            const courses = await Courses.findAll({
                where: { id: courseIds },
                transaction
            });

            // Add related courses to the teacher object
            teachers.dataValues.Courses = courses; // Directly assign courses array
        }

        await transaction.commit();

        res.status(200).json({
            teachers: teachers,
            success: true,
            message: "Successfully fetched teacher by ID"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error.message,
            success: false,
            message: 'Error in getting the teacher'
        });
    }
}

exports.findAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        /*      const searchTerm = req.query.searchTerm;
             if (searchTerm) {
                 where = {
                     [Op.or]: [
                         { telecallerPersonName: { [Op.like]: `%${searchTerm}%` } }, // Using 'like' operator for partial matching
                         // Add more fields for searching if needed
                     ],
                 };
             }
        */
        let subQuery=false
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
            ], include: [{ model: Role }],
            transaction

        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator")
            where = {}
        else {
            where = { roleId: loggedInUserId }
        }
        let conditions2 = { where, include: [{ model: User, attributes: { exclude: ['password', 'expireToken', 'resentPassword', 'passwordResetOtp'] }, include: [{ model: Role }] }, { model: Address }], order: [['updatedAt', 'DESC']],subQuery, transaction }

        const obj = {
            page: req.query.page,
            model: Teacher,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const teachers = await paginationfun.pagination(obj)
        await transaction.commit();
        if (teachers) {
            res.status(200).json({
                teachers: teachers,
                success: teachers.rows.length ? true : false,
                message: teachers.rows.length ?"Get All Data Success": "No data Found",
       
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
        const teacherId = req.params.teachersId;

        // Fetch the teacher by ID
        const teacher = await Teacher.findOne({ where: { id: teacherId }, transaction });
        if (!teacher) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }
         // Check if another teacher with the same email exists
         const useremail = await Teacher.findOne({ where: { Email: req.body.Email, id: { [Op.ne]: teacherId } }, transaction });
         if (useremail) {
             await transaction.rollback();
             return res.status(400).json({ // Corrected the status code to 400 for a validation error
                 success: false,
                 message: "The email address you entered is already associated with an account. Please use a different email or log in with your existing account."
             });
         }
 

        // Prepare the update data
        const updatedTeacherData = {
            Name: req.body.Name,
            LastName: req.body.LastName,
            Email: req.body.Email,
            DOB: req.body.DOB,
            TeacherType: req.body.TeacherType,
            Username: req.body.Username,
            PhoneNumber: req.body.PhoneNumber,
            YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
            image: req.file ? req.file.filename : teacher.image,
            CousesId: req.body.CousesId
        };

        // Update the teacher
        await Teacher.update(updatedTeacherData, { where: { id: teacherId }, transaction });

        // Fetch the associated user
        const user = await User.findOne({ where: { teacherId: teacherId }, transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Associated user not found"
            });
        }

        // Fetch the address associated with the teacher
        let address = await Address.findOne({ where: { AddressableId: teacherId }, transaction });

        // Update or create the address based on the association
        req.body.AddressableType = "Instructor";
        if (address) {
            await Address.update(req.body, { where: { id: address.id }, transaction });
        } else {
            req.body.AddressableId = teacherId;
            await Address.create(req.body, { transaction });
        }

        // Prepare the updated user data
        const updatedUserData = {
            name: updatedTeacherData.Name,
            userName: updatedTeacherData.Username,
            phoneNumber: updatedTeacherData.PhoneNumber,
            email: updatedTeacherData.Email,
            departmentId: 3, // Assuming departmentId 3 corresponds to 'Instructor'
            roleName: "Admin",
            teacherId: teacherId,
            studentId: 0,
            AddressableId: teacherId,
            image: updatedTeacherData.image,
            src: req.file ? req.file.path : user.src,
            lastname: updatedTeacherData.LastName,
        };

        // Update the user
        await User.update(updatedUserData, { where: { id: user.id }, transaction });

        // Commit the transaction
        await transaction.commit();

        // Fetch the updated teacher and address
        const updatedTeacher = await Teacher.findOne({ where: { id: teacherId } });
        const updatedAddress = await Address.findOne({ where: { AddressableId: teacherId } });

        // Respond with success
        res.status(200).json({
            teachers: updatedTeacher,
            address: updatedAddress,
            success: true,
            message: "Teacher updated successfully"
        });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({
            success: false,
            message: "Error while updating the teacher",
            error: error.message
        });
    }
};



exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const teachers = await Teacher.destroy({ where: { id: req.params.teachersId } ,transaction});
        await transaction.commit();
        res.status(200).json({
            teachers: teachers,
            success: true,
            message: "Delete Successfully Teachers"
        });
    } catch (error) { 
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Teachers not found'
        });
    }
}

