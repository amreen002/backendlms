const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { Student, User, Role, Address, Courses,Batch,Teacher, sequelize } = require('../models')
exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    const {
        Name,
        LastName,
        AddressableId,
        Email,
        Password,
        Username,
        PhoneNumber,
        Date,
        CoursesId,
        BatchId,
    } = req.body;
    try {
        if (!Password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const studentData = {
            Name,
            LastName,
            AddressableId,
            Email,
            Password: hashedPassword,
            Username,
            PhoneNumber,
            roleId: req.profile.id,
            Date,
            CoursesId,
            BatchId
        };

        let students = await Student.create(studentData, { transaction });

        // Set the necessary fields for the Address creation
        req.body.AddressableId = students.id;
        req.body.AddressableType = "Student";

        // Create the Address entry
        let address = await Address.create(req.body, { transaction });
        await Student.update(
            { AddressableId: address.id },
            { where: { id: students.id }, transaction }
        );
        let users = {
            studentId: students.id,
            name: students.Name,
            userName: students.Username,
            phoneNumber: students.PhoneNumber,
            email: students.Email,
            password: students.Password,
            assignToUsers: req.profile.id,
            departmentId: 4,
            roleName: "Admin",
        }
        await User.create(users, { transaction });
        await transaction.commit();
        return res.status(200).json({
            students: students,
            address: address,
            success: true,
            message: "Student Created SuccessFully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Student error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const students = await Student.findOne({ where: { id: req.params.studentsId }, include: [{ model: User, include: [{ model: Role }] }, { model: Address }, { model: Courses }], order: [['updatedAt', 'DESC']] });
        res.status(200).json({
            students: students,
            success: true,
            message: "get one Student by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Student'
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

        let students = await Student.findAll({
            include: [{
                model: User, include:
                    [{ model: Role }]
            },
            { model: Address },
            { model: Courses },
            { model: Batch,  include: [{model: Teacher,}]},
            ],
            order: [['updatedAt', 'DESC']]
        })
        res.status(200).json({
            students: students,
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
            Username: req.body.Username,
            PhoneNumber: req.body.PhoneNumber,
            roleId: req.profile.id,
            Date: req.body.Date,
            CoursesId: req.body.CoursesId,
            BatchId: req.body.BatchId
        }
        let students = await Student.update(data, { where: { id: req.params.studentsId }, order: [['updatedAt', 'DESC']] });
        // Find the associated address
        const address = await Address.findOne({ where: { AddressableId: req.params.studentsId }, transaction });

        if (!address) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Re-fetch the updated FrontDesk entry
        students = await Student.findOne({ where: { id: req.params.studentsId }, transaction });
        if (!students) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Students not found"
            });
        }

        // Set the required fields for updating the Address entry
        req.body.AddressableId = students.id;
        req.body.AddressableType = "Student";

        // Update the Address entry
        await Address.update(req.body, { where: { id: address.id }, transaction });

        // Retrieve the updated Address entry
        const updatedAddress = await Address.findOne({ where: { id: address.id }, transaction });

        let users = {
            name: students.Name,
            userName: students.Username,
            phoneNumber: students.PhoneNumber,
            email: students.Email,
/*             assignToUsers: req.profile.id, */
            departmentId: 4,
            roleName: "Admin",
        }
        let usersupdate = await User.findOne({ where: { studentId: req.params.studentsId }, transaction });
        await User.update(users, { where: { id: usersupdate.id }, transaction });
        // Commit the transaction
        await transaction.commit();

        res.status(200).json({
            students: students,
            address: updatedAddress,
            success: true,
            message: "Update Successfully Student"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Student"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const students = await Student.destroy({ where: { id: req.params.studentsId } });
        res.status(200).json({
            students: students,
            success: true,
            message: "Delete Successfully Student"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Student not found'
        });
    }
}

