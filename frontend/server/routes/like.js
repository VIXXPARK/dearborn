const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Like} =require('../models/Like')


router.post('/upVote', (req, res)=> {
    const like = new Like(req.body)

    like.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})

router.post('/myVote', (req, res)=>{
    Like.find({postId : req.body.postId}, (err, likes)=>{
        if(err) return res.status(400).json({success: false})
        return res.json({success: true, likes})
    })
})

module.exports = router