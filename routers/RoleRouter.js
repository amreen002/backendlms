const express = require('express');
let router = express.Router();
let role = require('../controllers/roleController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addrole', checkauth, getLogedInUser, role.create)

router.get('/listrole',checkauth, getLogedInUser, role.findAll);

router.get('/listrole/:roleId', checkauth, getLogedInUser,role.findOne);

router.put('/viewsrole/:roleId', checkauth, getLogedInUser, role.update);

router.delete('/deleterole/:roleId', checkauth, getLogedInUser, role.delete);

module.exports = router;