const express = require('express');
let router = express.Router();
let UserPermission = require('../controllers/userpermissionController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/adduserpermission', checkauth, getLogedInUser, UserPermission.create)

router.get('/listuserpermission',checkauth, getLogedInUser, UserPermission.findAll);

router.get('/listuserpermission/:userpermissionId', checkauth, getLogedInUser,UserPermission.findOne);

router.put('/viewsuserpermission/:userpermissionId', checkauth, getLogedInUser, UserPermission.update);

router.delete('/deleteuserpermission/:userpermissionId', checkauth, getLogedInUser, UserPermission.delete);

module.exports = router;