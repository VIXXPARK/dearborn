const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Product} =require('../models/Product')

var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, `server/uploads/`)
      },
    filename : (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter : (req, file, cb) => {
      const ext = path.extname(file.originalname)
      if(ext !== '.jpt' || ext !=='.png'){
        return cb(res.status(400).end('only jpg, png are allowed'), false)
      }
      cb(null, true)
    }
})

var upload = multer({storage : storage}).array('files')

router.post('/uploadImages', (req, res) => {
  console.log(req)
  /*
  mkdirp(`/server/uploads/${}`)
  */
  /*
    upload(req, res, err => {
      if(err) return res.status(400).json({success: false, err})
      
    })
  */
})

module.exports = router