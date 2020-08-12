const express = require('express')
const router = express.Router()
const multer = require('multer')
const mkdirp = require('mkdirp')

const {auth} = require('../middleware/auth')

const {Vote} =require('../models/Vote')


router.post('/upVote', (req, res)=> {
    const vote = new Vote(req.body)

    vote.save((err, votes) => {
        if(err) return res.json({success: false, err})
        return res.json({success:true})
    })
})

module.exports = router