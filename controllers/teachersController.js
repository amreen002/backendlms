
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { Teacher, User, Role, Address, sequelize } = require('../models'); // Adjust the path as necessary

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log(req.file)
    const { Password, Name, LastName, AddressableId, Email, DOB, TeacherType, Username, PhoneNumber, YourIntroducationAndSkills } = req.body;

    try {
      
        if (!Password) {
            throw new Error('Password is required');
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
            YourIntroducationAndSkills
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
            image: req.file ? req.file.filename : null,
            src: req.file ? req.file.path : null,
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
        const teachers = await Teacher.findOne({ where: { id: req.params.teachersId},attributes: { exclude: ['Password'] }, include: [{ model: User,attributes: { exclude: ['password','expireToken','resentPassword','passwordResetOtp'] }, include: [{ model: Role }] }, { model: Address }], order: [['updatedAt', 'DESC']],transaction });
        await transaction.commit();

        res.status(200).json({
            teachers: teachers,
            success: true,
            message: "get one Teachers by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Teachers'
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
        let teachers = await Teacher.findAll({where, include: [{ model: User,attributes: { exclude: ['password','expireToken','resentPassword','passwordResetOtp'] }, include: [{ model: Role }] }, { model: Address }], order: [['updatedAt', 'DESC']] ,transaction})
        await transaction.commit();
        res.status(200).json({
            teachers: teachers,
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
    const transaction = await sequelize.transaction();
    try {
        const data = {
            Name: req.body.Name,
            LastName: req.body.LastName,
            AddressableId: req.body.AddressableId,
            Email: req.body.Email,
            DOB: req.body.DOB,
            TeacherType: req.body.TeacherType,
            Username: req.body.Username,
            PhoneNumber: req.body.PhoneNumber,
            YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
        };

        await Teacher.update(data, { where: { id: req.params.teachersId }, transaction });

        const user = await User.findOne({ where: { teacherId: req.params.teachersId }, transaction });
  
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Associated user not found"
            });
        }

        const updatedTeacher = await Teacher.findOne({ where: { id: req.params.teachersId }, transaction });
        if (!updatedTeacher) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        let address = await Address.findOne({ where: { AddressableId: req.params.teachersId }, transaction });
        if (user.teacherId === updatedTeacher.id) {
            const addressusers = await Address.findOne({ where: { AddressableId: user.id }, transaction });
            req.body.AddressableId = user.id;
            req.body.AddressableType = "Instructor";
            await Address.update(req.body, { where: { id: addressusers.id }, transaction });
        }else{
            req.body.AddressableId = req.params.teachersId;
            req.body.AddressableType = "Instructor";
            await Address.update(req.body, { where: { id: address.id }, transaction });
    
        }
        
       
        const updatedAddress = await Address.findOne({ where: { id: address }, transaction });

        const updatedUserData = {
            name: updatedTeacher.Name,
            userName: updatedTeacher.Username,
            phoneNumber: updatedTeacher.PhoneNumber,
            email: updatedTeacher.Email,
            departmentId: 3, // Assuming departmentId 3 corresponds to 'Instructor'
            roleName: "Admin",
            teacherId: updatedTeacher.id,
            studentId: 0,
            AddressableId: updatedTeacher.AddressableId,
            image: req.file ? req.file.filename : user.image,
            src: req.file ? req.file.path : user.src,
        };

        await User.update(updatedUserData, { where: { id: user.id }, transaction });
        await transaction.commit();

        res.status(200).json({
            teachers: updatedTeacher,
            address: updatedAddress,
            success: true,
            message: "Teacher updated successfully"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Error while updating the teacher"
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

