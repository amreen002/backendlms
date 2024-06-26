var express = require('express')
var multer  = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

var upload = multer({storage:storage,limits:{
    fileSize: 1024*1024*10 
  },})

module.exports = upload;