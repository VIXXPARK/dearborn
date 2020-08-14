const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Post} =require('../models/Post')
const {User} = require('../models/User')

var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, `uploads/`)
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
      if(err) return res.status(400).json({success: false, err})
      var paths=""
      req.files.forEach(file => {
        paths = paths.concat(file.path+"&&") //json에 array가 안들어가서 string으로 이어붙임
      })
      return res.status(200).json({success : true, images : paths})
    })
})

router.post('/uploadPost', (req, res)=> {
  const post = new Post(req.body)
  
  post.save((err)=>{
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({success : true})
  })
})

router.get('/getPosts', (req, res) => {

  let order = req.body.order ? req.body.order : "desc"
  let sortBy = req.body.sortBy ? req.body.sortBy : "createdAt"

  Post.find()
  .sort([[sortBy, order]])
  .exec((err, posts) => {
    if(err){
      console.log(err)
      return res.status(400).json({success:false, err})
    }
    return res.status(200).json({success:true, posts})
  })
})

module.exports = router