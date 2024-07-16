const express = require('express');
let router = express.Router();
let questionscategory = require('../controllers/questionscategoryController');
let { checkauth, getLogedInUser } = require('../middlware/userAuth')
router.post('/questionscategory', checkauth, getLogedInUser, questionscategory.create)

router.get('/questionscategory', checkauth, getLogedInUser, questionscategory.findAll);

router.get('/questionscategory/:questionscategoryId', checkauth, getLogedInUser, questionscategory.findOne);

router.patch('/questionscategory/:questionscategoryId', checkauth, getLogedInUser, questionscategory.update);

router.delete('/questionscategory/:questionscategoryId', checkauth, getLogedInUser, questionscategory.delete);

module.exports = router;