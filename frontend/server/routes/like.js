const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Like} =require('../models/Like')
const {Dislike} =require('../models/Dislike')



router.post('/upLikes', (req, res)=> {
    const like = new Like(req.body)

    like.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})


router.post('/unLikes', (req, res)=> {
    Like.findOneAndDelete({postId : req.body.postId, userId : req.body.userId})
    .exec((err, doc)=> {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})

router.post('/getLikes', (req, res)=>{
    Like.find({postId : req.body.postId}, (err, likes)=>{
        if(err) return res.status(400).json({success: false})
        return res.json({success: true, likes})
    })
})

router.post('/upDislikes', (req, res)=> {
    const dislike = new Dislike(req.body)

    dislike.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})


router.post('/unDislikes', (req, res)=> {
    Dislike.findOneAndDelete({postId : req.body.postId, userId : req.body.userId})
    .exec((err, doc)=> {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})

router.post('/getDislikes', (req, res)=>{
    Dislike.find({postId : req.body.postId}, (err, dislikes)=>{
        if(err) return res.status(400).json({success: false})
        return res.json({success: true, dislikes})
    })
})

module.exports = router