const express = require('express');
let router = express.Router();
let saleteam = require('../controllers/saleteamController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addsaleteam', checkauth, getLogedInUser, saleteam.create)

router.get('/listsaleteam',checkauth, getLogedInUser, saleteam.findAll);

router.get('/listsaleteam/:saleteamId', checkauth, getLogedInUser,saleteam.findOne);

router.patch('/viewssaleteam/:saleteamId', checkauth, getLogedInUser, saleteam.update);

router.delete('/deletesaleteam/:saleteamId', checkauth, getLogedInUser, saleteam.delete);

module.exports = router;