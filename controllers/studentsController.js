const path = require('path');
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const { Student, User, Role, Address, Courses,Batch,Teacher, sequelize } = require('../models')
let paginationfun = require("../controllers/paginationController");
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
    const image =req.file? req.file.filename :null
    try {
        if (!Password) {
            throw new Error('Password is required');
        }
        let useremail = await Student.findOne({where:{Email:req.body.Email},transaction})
        if (useremail) {
            await transaction.rollback();
            return res.status(404).json({ message:"The email address you entered is already associated with an account. Please use a different email or log in with your existing account." });
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
            BatchId,
            image
        };

        let students = await Student.create(studentData, { transaction });

        const addressData = {
            AddressableId: students.id,
            AddressableType: "Instructor",
            ...req.body
        };

        const address = await Address.create(addressData, { transaction });

        await Student.update(
            { AddressableId: address.id },
            { where: { id: students.id }, transaction }
        );

        const updatedStudent = await Student.findOne({ where: { id: students.id }, transaction });

        const userData = {
            studentId: students.id,
            name: students.Name,
            userName: students.Username,
            phoneNumber: students.PhoneNumber,
            email: students.Email,
            password: students.Password,
            assignToUsers: req.profile.id,
            departmentId: 4,
            roleName: "Admin",
            AddressableId: address.id,
            image: students.image,
            src:  req.file? req.file.path :null,
            lastname:students.LastName
        };

        const user = await User.create(userData, { transaction });

        await transaction.commit();

        return res.status(200).json({
            students: updatedStudent,
            address: address,
            user: user,
            success: true,
            message: "Student created successfully"
        });

    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Error creating Student"
        });
    }
};


exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const students = await Student.findOne({ where: 
            { id: req.params.studentsId}, attributes: { exclude: ['Password'] },
            include: [
                { model: User,attributes: { exclude: ['password','expireToken','resentPassword','passwordResetOtp'] },include: [{ model: Role }] }, { model: Courses },
                { model: Batch,  include: [{model: Teacher,}]},
                { model: Address },
            ], order: [['updatedAt', 'DESC']],transaction });
            await transaction.commit();
            res.status(200).json({
            students: students,
            success: true,
            message: "get one Student by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Student'
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
        let where ;
        let subQuery=false

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

           
     
        let conditions2
        if (req.query.Instructor) {
            if (loggedInUser.Role.Name == "Instructor"){
                conditions2 = {
                    attributes: { exclude: ['Password'] },
                    include: [{
                        model: User,include:
                            [{ model: Role }]
                    },
                    { model: Address },
                    { model: Courses },
                    { model: Batch ,where :{InstructorId: loggedInUser.teacherId },  include: [{model: Teacher,}]},
                    ],
                    order: [['updatedAt', 'DESC']],
                    subQuery,
                    transaction
                }
            }
        }else{
            conditions2 = {
                where,
                attributes: { exclude: ['Password'] },
                include: [{
                    model: User,include:
                        [{ model: Role }]
                },
                { model: Address },
                { model: Courses },
                { model: Batch,  include: [{model: Teacher,}]},
                ],
                order: [['updatedAt', 'DESC']],
                subQuery,
                transaction
            }
        }
        const obj = {
            page: req.query.page,
            model: Student,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
          }
        const students = await paginationfun.pagination(obj)
        await transaction.commit();
        if (students) {
            res.status(200).json({
                students: students,
                success: students.rows.length ?true:false,
                message: students.rows.length ?"Get All Data Success":"Not Data Found"
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


       const userfindstudent= await Student.findOne({ where: { id: req.params.studentsId }, order: [['updatedAt', 'DESC']] });
       
       if (!userfindstudent) {
        await transaction.rollback();
        return res.status(404).json({
            success: false,
            message: "Associated User Find Student not found"
        })
      }
      const useremail = await User.findOne({ where: { Email: req.body.Email, id: { [Op.ne]: req.params.studentsId } }, transaction });
      if (useremail) {
          await transaction.rollback();
          return res.status(400).json({ // Corrected the status code to 400 for a validation error
              success: false,
              message: "The email address you entered is already associated with an account. Please use a different email or log in with your existing account."
          });
      }
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
            BatchId: req.body.BatchId,
            image: req.file? req.file.filename :userfindstudent.image,
        }
        await Student.update(data, { where: { id: req.params.studentsId }, order: [['updatedAt', 'DESC']] });
     

        const user = await User.findOne({ where: { studentId: req.params.studentsId }, transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Associated user not found"
            });
        }

        let address = await Address.findOne({ where: { AddressableId: req.params.studentsId }, transaction });

        req.body.AddressableId = req.params.studentsId;
        req.body.AddressableType = "Instructor";
        await Address.update(req.body, { where: { id: address.id }, transaction });

        const updatedStudent = await Student.findOne({ where: { id: req.params.studentsId }, transaction });
        if (!updatedStudent) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const updatedAddress = await Address.findOne({ where: { id: address }, transaction });

        const updatedUserData = {
            name: updatedStudent.Name,
            userName: updatedStudent.Username,
            phoneNumber: updatedStudent.PhoneNumber,
            email: updatedStudent.Email,
            departmentId: 4, // Assuming departmentId 3 corresponds to 'Instructor'
            roleName: "Admin",
            studentId: updatedStudent.id,
            teacherId: 0,
            AddressableId: updatedStudent.AddressableId,
            image: req.file ? req.file.filename : updatedStudent.image,
            src: req.file ? req.file.path : user.src,
            lastname:updatedStudent.LastName
        };

        await User.update(updatedUserData, { where: { id: user.id }, transaction });
        await transaction.commit();

        res.status(200).json({
            students: updatedStudent,
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

}

exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const students = await Student.destroy({ where: { id: req.params.studentsId } ,transaction});
        await transaction.commit();
        res.status(200).json({
            students: students,
            success: true,
            message: "Delete Successfully Student"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Student not found'
        });
    }
}

