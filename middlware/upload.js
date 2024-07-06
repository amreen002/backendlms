const express = require('express');
const multer  = require('multer');
const path = require('path');

const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/documents');
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const originalName = file.originalname;
        cb(null, `${timestamp}-${originalName}`);
    }
});

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/videos');
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const originalName = file.originalname;
        cb(null, `${timestamp}-${originalName}`);
    }
});

const pdfFilter = function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const imageFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, JPG, and JPEG image files are allowed'), false);
    }
};

const videoFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed'), false);
    }
};

const uploadPDF = multer({ 
    storage: pdfStorage,
    limits: {
        fileSize: 1024*1024*10 // 10 MB
    },
    fileFilter: pdfFilter
});

const uploadImage = multer({ 
    storage: imageStorage,
    limits: {
        fileSize: 1024*1024*10
    },
    fileFilter: imageFilter
});

const uploadVideo = multer({ 
    storage: videoStorage,
    limits: {
        fileSize: 1024*1024*10
    },
    fileFilter: videoFilter
});

module.exports = {
    uploadPDF,
    uploadImage,
    uploadVideo
};
