const express = require('express');
let router = express.Router();
let { uploadPDF, uploadImage, uploadVideo }  = require('../middlware/upload')

let video = require('../controllers/videoController');

let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/video', checkauth, getLogedInUser, uploadVideo.array('files'), video.create)

router.get('/video',checkauth, getLogedInUser, video.findAll);

router.get('/video/:videoId', checkauth, getLogedInUser,video.findOne);

router.patch('/video/:videoId', checkauth, getLogedInUser, uploadVideo.array('files'), video.update);

router.delete('/video/:videoId', checkauth, getLogedInUser, video.delete);

module.exports = router;