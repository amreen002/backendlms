const express = require('express');
let router = express.Router();
let counselordepartment = require('../controllers/counselordepartmentController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addcounselordepartment', checkauth, getLogedInUser, counselordepartment.create)

router.get('/listcounselordepartment',checkauth, getLogedInUser, counselordepartment.findAll);

router.get('/listcounselordepartment/:counselordepartmentId', checkauth, getLogedInUser,counselordepartment.findOne);

router.put('/viewscounselordepartment/:counselordepartmentId', checkauth, getLogedInUser, counselordepartment.update);

router.delete('/deletecounselordepartment/:counselordepartmentId', checkauth, getLogedInUser, counselordepartment.delete);

module.exports = router;