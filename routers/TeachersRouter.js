const express = require('express');
let router = express.Router();
let teachers = require('../controllers/teachersController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addteachers', checkauth, getLogedInUser, teachers.create)

router.get('/listteachers',checkauth, getLogedInUser, teachers.findAll);

router.get('/listteachers/:teachersId', checkauth, getLogedInUser,teachers.findOne);

router.put('/viewsteachers/:teachersId', checkauth, getLogedInUser, teachers.update);

router.delete('/deleteteachers/:teachersId', checkauth, getLogedInUser, teachers.delete);

module.exports = router;