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
  .populate('writer')
  .sort([[sortBy, order]])
  .exec((err, posts) => {
    if(err){
      console.log(err)
      return res.status(400).json({success:false, err})
    }
    return res.status(200).json({success:true, posts})
  })
})

router.post('/getPostDetail', (req, res)=>{
  Post.find({_id : req.body.postId})
  .populate('writer')
  .exec((err, detailPost) => {
    if(err){
      console.log(err)
      return res.status(400).json({success:false, err})
    }
    console.log(detailPost)
    return res.status(200).json({success:true, detailPost})
  })
})

router.post('/upView', (req, res)=>{
  Post.findOneAndUpdate({_id : req.body.postId}, { $inc :{views : 1}})
  .exec((err, doc)=>{
    if(err){
      return res.status(400).json({success:false, err})
    }
    return res.status(200).json({success: true})
  })
})

router.post('/getProfile', (req, res)=>{ //임시, 삭제예정
  User.findOne({nickname : req.body.nickname})
  .exec((err, user)=>{
    if(err) return res.status(400).json({success:false, err})

    Post.find({writer : user._id})
    .populate('writer')
    .exec((err, repos)=>{
      if(err) return res.status(400).json({success:false, err})
      return res.status(200).json({success: true, repos, user})
    })
  })
})

router.get('/getRepos', (req, res)=>{
  Repo.find({})
  .exec((err, repos)=>{
      if(err) return res.status(400).json({success:false})
      return res.status(200).json({success:true, repos})
  })
})

router.post('/getProfile', (req, res)=>{
  User.findOne({nickname : req.body.designer})
  .exec((err, user)=>{
      if(err) return res.status(400).json({success:false})
      Repo.find({writer : user._id})
      .populate('writer')
      .exec((err, repos)=>{
          if(err) return res.status(400).json({success: false})
          return res.status(200).json({success: true, repos, user})
      })
  })
})


module.exports = router