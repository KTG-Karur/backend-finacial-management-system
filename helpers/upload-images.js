'use strict';

const multer = require('multer');
const path =  require('path');
const message = require('./message');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(new Error(message.UNSUPPORTED_FILE), false)
    }
}

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024*1024*5
    },
    fileFilter : fileFilter
})

module.exports = {
    upload
}