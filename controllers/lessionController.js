
const { Op } = require('sequelize')
const path =  require("path");
const { Lession, Role, User ,Batch, Topic ,Courses,Categories} = require('../models')
exports.create = async (req, res) => {
    try {

         let data = {
            LessionTitle:req.body.LessionTitle,
            CoursesId:req.body.CoursesId,
            TopicId:req.body.TopicId,
            LessionUpload:req.file.path,
         }
        const lession = await Lession.create(data)

        return res.status(200).json({
            lession: lession,
            success: true,
            message: "Lession Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Lession  error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const lession = await Lession.findOne({ where: { id: req.params.lessionId }, include: [{model:Courses,include: [{ model: Topic }] }] });
        res.status(200).json({
            lession: lession,
            success: true,
            message: "get one Lession by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Lession'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where = {}

        let lession = await Lession.findAll({ where, include: [{model:Courses,include: [{ model: Topic },{model:Categories},{  model: Batch,}] }]});
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Get All Lession Data Success"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Lession Data Success"
        });
    }
}

exports.update = async (req, res) => {
    try {
        const exitedpath = await Lession.findOne({ where: { id: req.params.lessionId } });
        if (!exitedpath.LessionUpload) {
            
        }
        let data = {
            LessionTitle:req.body.LessionTitle,
            CoursesId:req.body.CoursesId,
            TopicId:req.body.TopicId,
            LessionUpload:req.file?req.file.path :exitedpath.LessionUpload,
         }
        const lession = await Lession.update(data, { where: { id: req.params.lessionId } });
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Update Successfully Lession"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Lession"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const lession = await Lession.destroy({ where: { id: req.params.lessionId } });
        res.status(200).json({
            lession: lession,
            success: true,
            message: "Delete Successfully Lession"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Lession not found'
        });
    }
}


