
const { Op } = require('sequelize')
const path =  require("path");
const { Lession, Role, User ,Batch, Topic ,Courses,Categories,sequelize} = require('../models');
let paginationfun = require("../controllers/paginationController");
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
        const lession = await Lession.findOne({ where: { id: req.params.lessionId}, include: [{model:Courses,include: [{ model: Topic }] }],transaction });
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
        let subQuery =false
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
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator" ||loggedInUser.Role.Name == "Super Admin" )
            where = {}
        else {
            where = { userId: loggedInUserId }
        }
        let conditions2 =  { where, include: [{ model: Topic },{model:Courses,include: [{model:Categories},{  model: Batch}] }],order: [['updatedAt', 'DESC']],subQuery,transaction}
    
        const obj = {
            page: req.query.page,
            model: Lession,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const lession = await paginationfun.pagination(obj)
        await transaction.commit(); 
        if(lession){
        res.status(200).json({
            lession: lession,
            success: lession.rows.length ?true:false,
            message: lession.rows.length ?"Get All Lession Data Success":"No data Found"
        });}
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
        const existingLession = await Lession.findOne({ where: { id: req.params.lessionId }, transaction });
        if (!existingLession) {
            return res.status(404).json({ message: 'Existing Lession Path not found' });
        }

        let uploadPDF = [];
        if (req.files) {
            for (let index = 0; index < req.files.length; index++) {
                const originalNameWithoutExtension = path.basename(req.files[index].originalname, path.extname(req.files[index].originalname));
                uploadPDF.push({
                    path: req.files[index].path,
                    name: originalNameWithoutExtension,
                });
            }
        }

        // Combine existing files with new uploads
        let updatedLessionUpload = existingLession.LessionUpload || [];
        if (req.body.removedFiles) {
            const removedFiles = JSON.parse(req.body.removedFiles);
            updatedLessionUpload = updatedLessionUpload.filter(file => !removedFiles.includes(file.path));
        }
        if (uploadPDF.length > 0) {
            updatedLessionUpload = updatedLessionUpload.concat(uploadPDF);
        }

        let data = {
            LessionTitle: req.body.LessionTitle,
            CoursesId: req.body.CoursesId,
            TopicId: req.body.TopicId,
            userId: req.profile.id,
            LessionUpload: updatedLessionUpload
        };

        await Lession.update(data, { where: { id: req.params.lessionId }, transaction });
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: "Update Successfully Model"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Error While Updating The Model"
        });
    }
};


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


