const express = require('express');
let router = express.Router();
let TelecallerTeam = require('../controllers/telecallerteamController');
let {checkauth,getLogedInUser} = require('../middlware/userAuth')
router.post('/addtelecallerteam', TelecallerTeam.create)

router.get('/listtelecallerteam', TelecallerTeam.findAll);
router.get('/usertelecallerteam',checkauth, getLogedInUser, TelecallerTeam.TeamFindAll);
router.get('/listtelecallerteam/:telecallerteamId',TelecallerTeam.findOne);

router.patch('/updatetelecallerteam/:telecallerteamId',TelecallerTeam.update);

router.delete('/deletesaleteam/:telecallerteamId', TelecallerTeam.delete);

module.exports = router;