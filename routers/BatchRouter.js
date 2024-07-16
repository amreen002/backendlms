const express = require('express');
let router = express.Router();
let batches = require('../controllers/batchesController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addbatches', checkauth, getLogedInUser, batches.create)

router.get('/listbatches', checkauth, getLogedInUser, batches.findAll);

router.get('/batches', batches.findAllUsers);

router.get('/listbatches/:batchesId', checkauth, getLogedInUser,batches.findOne);

router.patch('/viewsbatches/:batchesId', checkauth, getLogedInUser, batches.update);

router.delete('/deletebatches/:batchesId', checkauth, getLogedInUser, batches.delete);

module.exports = router;