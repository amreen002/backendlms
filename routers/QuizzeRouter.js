const express = require('express');
let router = express.Router();
let quizze = require('../controllers/quizzeController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/quizze', checkauth, getLogedInUser, quizze.create)

router.get('/quizze',checkauth, getLogedInUser ,quizze.findAll);

router.get('/quizze/:quizzeId', checkauth, getLogedInUser,quizze.findOne);

router.get('/quizzeandquesation/:quizzeId/:questionId', checkauth, getLogedInUser,quizze.QuestionWisefindOne);

router.patch('/quizzeandquesation/:quizzeId/:questionId', checkauth, getLogedInUser,quizze.QuestionWiseUpdate);

router.patch('/quizze/:quizzeId', checkauth, getLogedInUser, quizze.update);

router.delete('/quizze/:quizzeId', checkauth, getLogedInUser, quizze.delete);

module.exports = router;