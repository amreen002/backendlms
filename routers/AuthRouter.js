const express = require('express')
const router = express.Router()
const { User } = require('../models')
const loginValidator  = require('../validations/authvalidator');
const validations = require('../validations/validator');
const Usersign = require('../controllers/authControllers')
let {getLogedInUser} = require('../middlware/userAuth')
router.post('/login',/* loginValidator.authValidator,validations.validate, */ Usersign.login)
router.post('/logout', Usersign.signout)
router.get('/userwisedata', getLogedInUser,Usersign.userWisedata);

module.exports = router;



