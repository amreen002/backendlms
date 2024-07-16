const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')
let lession = require('../controllers/lessionController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/lession', checkauth, getLogedInUser, uploadPDF.array('files'),lession.create)

router.get('/lession', checkauth, getLogedInUser, lession.findAll);

router.get('/lession/:lessionId', checkauth, getLogedInUser,lession.findOne);

router.patch('/lession/:lessionId', checkauth, getLogedInUser,uploadPDF.array('files'), lession.update);

router.delete('/lession/:lessionId', checkauth, getLogedInUser, lession.delete);

module.exports = router;