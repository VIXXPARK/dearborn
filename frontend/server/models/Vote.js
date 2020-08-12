const mongoose = require('mongoose')
const Schema = mongoose.Schema


const voteSchema = mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Post'
    }
}, {timestamps : true})

const Vote = mongoose.model('Vote', voteSchema)

module.exports = {Vote}