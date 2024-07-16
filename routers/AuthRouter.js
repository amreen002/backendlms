const express = require('express')

const router = express.Router()

const { User } = require('../models')

const loginValidator  = require('../validations/authvalidator');

const validations = require('../validations/validator');

const users = require('../controllers/authControllers')

let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')

let {getLogedInUser} = require('../middlware/userAuth')

router.post('/login',/* loginValidator.authValidator,validations.validate, */ users.login)

router.post('/signup',uploadImage.single('file'), users.signup)

router.get('/signup/:usersId',users.findOne);

router.patch('/signup/:usersId',uploadImage.single('file'),users.update);

router.post('/logout', users.signout)

router.get('/userwisedata', getLogedInUser,users.userWisedata);

router.get('/country', users.country);

module.exports = router;



