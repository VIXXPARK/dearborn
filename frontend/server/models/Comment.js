const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentSchema = mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Post'
    },
    content : {
        type : String,
    }
}, {timestamps : true})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = {Comment}