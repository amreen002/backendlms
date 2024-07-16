
const { Op } = require('sequelize')
const path =  require("path");
const { Lession, Role, User ,Batch, Topic ,Courses,Categories,sequelize} = require('../models');
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {

        
        let images = [];
        for (let index = 0; index < req.files.length; index++) {
            const originalNameWithoutExtension = path.basename(req.files[index].originalname, path.extname(req.files[index].originalname));
          images.push({
            path: req.files[index].path,
            name: originalNameWithoutExtension,
          });
        }

         let data = {
            LessionTitle:req.body.LessionTitle,
            CoursesId:req.body.CoursesId,
            TopicId:req.body.TopicId,
            userId : req.profile.id,
            LessionUpload:images
         }
        const lession = await Lession.create(data,{transaction})
        await transaction.commit();
        return res.status(200).json({
            lession: lession,
            success: true,
            message: "Lession Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Lession  error"
        })
    }

}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const userId = req.profile.id
        const lession = await Lession.findOne({ where: { id: req.params.lessionId ,userId:userId}, include: [{model:Courses,include: [{ model: Topic }] }],transaction });
        await transaction.commit();
        res.status(200).json({
            lession: lession,
            success: true,
            message: "get one Lession by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Lession'
        });
    }
}

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
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
            ], include: [{ model: Role }],
            transaction

        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator")
            where = {}
        else {
            where = { roleId: loggedInUserId }
        }
        let lession = await Lession.findAll({ where, include: [{ model: Topic },{model:Courses,include: [{model:Categories},{  model: Batch}] }],transaction});
        await transaction.commit();
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Get All Lession Data Success"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Lession Data Success"
        });
    }
}

exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const exitedpath = await Lession.findOne({ where: { id: req.params.lessionId },transaction });
        if (!exitedpath.LessionUpload) {
            return res.status(404).json({ message: 'Existing Lission Path not found' });
        }
        let uploadPDF = [];
        for (let index = 0; index < req.files.length; index++) {
            const originalNameWithoutExtension = path.basename(req.files[index].originalname, path.extname(req.files[index].originalname));
            uploadPDF.push({
            path: req.files[index].path,
            name: originalNameWithoutExtension,
          });
        }

        let data = {
            LessionTitle:req.body.LessionTitle,
            CoursesId:req.body.CoursesId,
            TopicId:req.body.TopicId,
            userId : req.profile.id,
            LessionUpload:req.files ? uploadPDF :exitedpath.LessionUpload,
         }
        const lession = await Lession.update(data, { where: { id: req.params.lessionId } ,transaction});
        await transaction.commit();
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Update Successfully Lession"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Lession"
        });
    }

}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const lession = await Lession.destroy({ where: { id: req.params.lessionId } ,transaction});
        await transaction.commit();
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Delete Successfully Lession"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Lession not found'
        });
    }
}


