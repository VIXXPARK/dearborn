const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {Comment} =require('../models/Comment')

router.post('/upComment', (req, res)=>{
    const comment = new Comment(req.body.variables)

    comment.save((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })
})

router.post('/getComment', (req, res)=> {
    Comment.find({postId : req.body.postId})
    .populate('userId')
    .exec((err, comments) => {
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true, comments})
    })
})

router.post('/delComment', (req, res)=> {
    Comment.findOneAndDelete({_id : req.body.commentId})
    .exec((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })
})

router.post('/fixComment', (req, res)=> {
    Comment.findOneAndUpdate({_id : req.body.commentId}, {content : req.body.content})
    .exec((err, doc)=> {
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })
})


module.exports = router