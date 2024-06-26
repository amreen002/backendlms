const express = require('express');
let router = express.Router();
let students = require('../controllers/studentsController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addstudents', checkauth, getLogedInUser, students.create)

router.get('/liststudents',checkauth, getLogedInUser, students.findAll);

router.get('/liststudents/:studentsId', checkauth, getLogedInUser,students.findOne);

router.put('/viewsstudents/:studentsId', checkauth, getLogedInUser, students.update);

router.delete('/deletestudents/:studentsId', checkauth, getLogedInUser, students.delete);

module.exports = router;