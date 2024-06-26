const express = require('express');
let router = express.Router();
let frontdesk= require('../controllers/frontdeskController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addfrontdesk', checkauth, getLogedInUser, frontdesk.create)

router.get('/listfrontdesk',checkauth, getLogedInUser, frontdesk.findAll);

router.get('/listfrontdesk/:frontdeskId', checkauth, getLogedInUser,frontdesk.findOne);

router.patch('/viewsfrontdesk/:frontdeskId',  checkauth, getLogedInUser, frontdesk.update);

router.delete('/deletefrontdesk/:frontdeskId', checkauth, getLogedInUser, frontdesk.delete);

router.get('/listcountry', checkauth, getLogedInUser,  frontdesk.country);

module.exports = router;