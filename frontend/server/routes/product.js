const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Product} =require('../models/Product')
/*
var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        
        cb(null, `uploads/`)
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.name}`)
      },
      fileFilter: (req, file, cb) => {
   
          const ext = path.extname(file.name)
          if(ext !== '.jpg' || ext !== '.png' || ext !== '.gif'){
              return cb(res.status(400).end('only jpg, png, gif are allowed'), false);
          }
          cb(null, true)
        }
})

var upload = multer({storage : storage}).single("file")
*/
router.post('/uploadImage', (req, res) => {
    console.log()
})

module.exports = router