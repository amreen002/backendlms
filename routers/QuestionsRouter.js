const express = require('express');
let router = express.Router();
let question = require('../controllers/questionController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/question', checkauth, getLogedInUser, question.create)

router.get('/question',checkauth, getLogedInUser,question.findAll);

router.get('/reportscard',checkauth, getLogedInUser,question.ReportsCard);

router.get('/question/:questionId', checkauth, getLogedInUser,question.findOne);

router.patch('/question/:questionId', checkauth, getLogedInUser, question.update);

router.delete('/question/:questionId', checkauth, getLogedInUser, question.delete);

module.exports = router;