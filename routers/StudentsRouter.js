const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')
let students = require('../controllers/studentsController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addstudents', checkauth, getLogedInUser,uploadImage.single('file'), students.create)

router.get('/liststudents',checkauth, getLogedInUser, students.findAll);

router.get('/liststudents/:studentsId', checkauth, getLogedInUser,students.findOne);

router.patch('/viewsstudents/:studentsId', checkauth, getLogedInUser, uploadImage.single('file'),students.update);

router.delete('/deletestudents/:studentsId', checkauth, getLogedInUser, students.delete);

module.exports = router;