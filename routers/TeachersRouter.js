const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')
let teachers = require('../controllers/teachersController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addteachers', checkauth, getLogedInUser,uploadImage.single('file'), teachers.create)

router.get('/listteachers',checkauth, getLogedInUser, teachers.findAll);

router.get('/listteachers/:teachersId', checkauth, getLogedInUser,teachers.findOne);

router.patch('/viewsteachers/:teachersId', checkauth, getLogedInUser,uploadImage.single('file'), teachers.update);

router.delete('/deleteteachers/:teachersId', checkauth, getLogedInUser, teachers.delete);

module.exports = router;