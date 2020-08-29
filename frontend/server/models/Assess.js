const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AssessSchema = mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Post'
    },
    km
}, {timestamps : true})

const Assess = mongoose.model('Assess', AssessSchema)

module.exports = {Assess}