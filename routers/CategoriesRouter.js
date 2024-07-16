const express = require('express');
let router = express.Router();
let categories = require('../controllers/categoriesController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/categories', checkauth, getLogedInUser, categories.create)

router.get('/categories', checkauth, getLogedInUser, categories.findAll);

router.get('/categories/:categoriesId', checkauth, getLogedInUser,categories.findOne);

router.patch('/categories/:categoriesId', checkauth, getLogedInUser, categories.update);

router.delete('/categories/:categoriesId', checkauth, getLogedInUser, categories.delete);

module.exports = router;