const express = require('express');
const router = express.Router();
const multer = require('multer')
const {User} = require("../models/User");

const {auth} = require('../middleware/auth')


var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, `uploads/profiles/`)
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

var upload = multer({storage : storage}).single('file')

router.get('/auth', auth, (req, res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAuth:true,
        email:req.user.email,
        nickname:req.user.nickname,
    })
})

router.post("/register", (req, res)=>{

    upload(req, res, err => {
        const data = {
            email : req.body.email,
            nickname : req.body.nickname,
            password : req.body.password,
            content : req.body.content,
            profileImage : req.file.path,
            job : req.body.job,
            major : req.body.major,
        }
        const user = new User(data)
        user.save((err)=>{
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success : true})
        })
    })
})

router.post('/checkEmail', (req, res)=>{
    User.findOne({email : req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                success:true
            })
        }else{
            return res.json({
                success:false
            })
        }
    })
})

router.post('/login', (req,res)=>{
    User.findOne({email : req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                success:false,
                message:'Auth failed, email not found'
            })
        }
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
                return res.json({
                    success: false,
                    message:'Wrong password'
                })
            
            user.generateToken((err, user)=>{
                if(err) res.status(400).send(err)

                res.cookie('w_authExp', user.tokenExp)
                res.cookie('w_auth', user.token)
                    .status(200).json({
                        success:true,
                        userId: user._id
                    })
            })
        })
    })
})

router.get('/logout', auth, (req,res)=> {
    User.findOneAndUpdate({_id:req.user._id}, {token: "", tokenExp:""}, (err, doc)=>{
        if(err) return res.status(400).json({success:false, err})

        return res.status(200).send({
            success:true
        })
    })
})

module.exports = router