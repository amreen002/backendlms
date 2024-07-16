const express = require('express');
let router = express.Router();

let studentquize = require('../controllers/stutenetquizeController');

let {checkauth,getLogedInUser} = require('../middlware/userAuth')

router.post('/studentquize', checkauth, getLogedInUser, studentquize.create)

router.get('/studentquize',checkauth, getLogedInUser, studentquize.findAll);

router.get('/studentquize/:studentquizeId', checkauth, getLogedInUser,studentquize.findOne);



module.exports = router;