const express = require('express');
let router = express.Router();
let topic = require('../controllers/topicController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/topic', checkauth, getLogedInUser, topic.create)

router.get('/topic',checkauth, getLogedInUser, topic.findAll);

router.get('/topic/:topicId', checkauth, getLogedInUser,topic.findOne);

router.put('/topic/:topicId', checkauth, getLogedInUser, topic.update);

router.delete('/topic/:topicId', checkauth, getLogedInUser, topic.delete);

module.exports = router;