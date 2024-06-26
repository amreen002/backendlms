
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { Teacher, User, Role, Address, sequelize } = require('../models'); // Adjust the path as necessary

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
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


        // Set the necessary fields for the Address creation
        req.body.AddressableId = teachers.id;
        req.body.AddressableType = "Instructor";

        // Create the Address entry
        let address = await Address.create(req.body, { transaction });
        await Teacher.update(
            { AddressableId: address.id },
            { where: { id: teachers.id }, transaction }
        );
        let users = {
            teacherId: teachers.id,
            name: teachers.Name,
            userName: teachers.Username,
            phoneNumber: teachers.PhoneNumber,
            email: teachers.Email,
            password: teachers.Password,
            assignToUsers: req.profile.id,
            departmentId: 3,
            roleName: "Admin",
        }
        await User.create(users, { transaction });
        await transaction.commit();
        return res.status(200).json({
            teachers: teachers,
            address: address,
            success: true,
            message: "Teacher Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Teacher error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const teachers = await Teacher.findOne({ where: { id: req.params.teachersId }, include: [{ model: User, include: [{ model: Role }] }, { model: Address }], order: [['updatedAt', 'DESC']] });
        res.status(200).json({
            teachers: teachers,
            success: true,
            message: "get one Teachers by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Teachers'
        });
    }
}

exports.findAll = async (req, res) => {
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

        let teachers = await Teacher.findAll({ include: [{ model: User, include: [{ model: Role }] }, { model: Address }], order: [['updatedAt', 'DESC']] })
        res.status(200).json({
            teachers: teachers,
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
    let transaction = await sequelize.transaction();
    try {
        let data = {
            Name: req.body.Name,
            LastName: req.body.LastName,
            AddressableId: req.body.AddressableId,
            Email: req.body.Email,
            DOB: req.body.DOB,
            TeacherType: req.body.TeacherType,
            Username: req.body.Username,
            PhoneNumber: req.body.PhoneNumber,
            roleId: req.profile.id,
            YourIntroducationAndSkills: req.body.YourIntroducationAndSkills,
        }
        let teachers = await Teacher.update(data, { where: { id: req.params.teachersId }, order: [['updatedAt', 'DESC']], transaction });
        // Find the associated address
        const address = await Address.findOne({ where: { AddressableId: req.params.teachersId }, transaction });

        if (!address) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Re-fetch the updated FrontDesk entry
        teachers = await Teacher.findOne({ where: { id: req.params.teachersId }, transaction });
        if (!teachers) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Teachers not found"
            });
        }

        // Set the required fields for updating the Address entry
        req.body.AddressableId = teachers.id;
        req.body.AddressableType = "Instructor";

        // Update the Address entry
        await Address.update(req.body, { where: { id: address.id }, transaction });

        // Retrieve the updated Address entry
        const updatedAddress = await Address.findOne({ where: { id: address.id }, transaction });

        let users = {
            name: teachers.Name,
            userName: teachers.Username,
            phoneNumber: teachers.PhoneNumber,
            email: teachers.Email,
            password: teachers.Password,
/*             assignToUsers: req.profile.id, */
            departmentId: 3,
            roleName: "Admin",
        }
        let usersupdate = await User.findOne({ where: { teacherId: req.params.teachersId }, transaction });
        await User.update(users, { where: { id: usersupdate.id }, transaction });
        await transaction.commit();

        res.status(200).json({
            teachers: teachers,
            address: updatedAddress,
            success: true,
            message: "Update Successfully Teachers"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Teachers"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const teachers = await Teacher.destroy({ where: { id: req.params.teachersId } });
        res.status(200).json({
            teachers: teachers,
            success: true,
            message: "Delete Successfully Teachers"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Teachers not found'
        });
    }
}

