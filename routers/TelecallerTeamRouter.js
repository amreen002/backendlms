const express = require('express');
let router = express.Router();
let TelecallerTeam = require('../controllers/telecallerteamController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addtelecallerteam',checkauth, getLogedInUser, TelecallerTeam.create)

router.get('/listtelecallerteam',checkauth, getLogedInUser, TelecallerTeam.findAll);
router.get('/usertelecallerteam',checkauth, getLogedInUser, TelecallerTeam.TeamFindAll);
router.get('/listtelecallerteam/:telecallerteamId',checkauth, getLogedInUser,TelecallerTeam.findOne);

router.patch('/updatetelecallerteam/:telecallerteamId',checkauth, getLogedInUser,TelecallerTeam.update);

router.delete('/deletesaleteam/:telecallerteamId',checkauth, getLogedInUser, TelecallerTeam.delete);

module.exports = router;
