const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')
let users = require('../controllers/usersController');
let {checkauth ,getLogedInUser,checkReadPermission}= require('../middlware/userAuth')
const usersvalidator  = require('../validations/uservalidator');
const validations = require('../validations/validator');
router.post('/users',/* usersvalidator.userValidator,validations.validate, */ checkauth, getLogedInUser,uploadImage.single('file'), users.create)

router.get('/users',checkauth, getLogedInUser,/* checkReadPermission */users.findAll);

router.get('/users/:usersId' ,checkauth, getLogedInUser,users.findOne);

router.patch('/users/:usersId', checkauth, getLogedInUser,uploadImage.single('file'),users.update);

router.delete('/users/:usersId',checkauth, getLogedInUser, users.delete);

router.get('/roles', checkauth, getLogedInUser,users.rolefindAll);

module.exports = router;