const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')
let courses = require('../controllers/coursesController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')

const classes  = require('../validations/classvalidator');

const validations = require('../validations/validator');

router.post('/addcourses', checkauth,getLogedInUser,classes.classValidator,validations.validate,uploadImage.single('file'),courses.create)

router.get('/listcourses', checkauth, getLogedInUser ,courses.findAll);

router.get('/courses',courses.findAllCourse);

router.get('/courses/:coursesId',courses.courseFindOne);


router.get('/listcourses/:coursesId', checkauth, getLogedInUser,courses.findOne);

router.get('/coursecode/:coursecodeId',checkauth, getLogedInUser,courses.coursecode);

router.get('/batche/:coursecodeId', checkauth, getLogedInUser,courses.coursebatches);

router.get('/students/:coursecodeId',checkauth, getLogedInUser,courses.coursestudents);

router.patch('/viewscourses/:coursesId', checkauth, getLogedInUser, uploadImage.single('file'),courses.update);

router.delete('/deletecourses/:coursesId', checkauth, getLogedInUser, courses.delete);

router.patch('/addcontentcourses/:coursesId', checkauth, getLogedInUser, courses.addcontentcourses);

module.exports = router;