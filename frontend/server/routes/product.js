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
    upload(req, res, err => {
      console.log(req)
      if(err) return res.status(400).json({success: false, err})
      var paths=""
      req.files.forEach(file => {
        paths = paths.concat(file.path+"&&") //json에 array가 안들어가서 string으로 이어붙임
      })
      console.log(paths)
      return res.status(200).json({success : true, images : paths})
    })
})

router.post('/uploadProduct', (req, res)=> {
  const product = new Product(req.body.variables)
  console.log(req.body)
  
  product.save((err)=>{
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({success : true})
  })
})

module.exports = router