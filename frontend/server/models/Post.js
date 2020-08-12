const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    title : {
        type : String,
        maxlength : 50,
        text : true,
    },
    images : {
        type : Array,
        default : [],
    },
    content : {
        type : String
    },
    vote : {
        type : Number,
        default : 0,
    },
    views : {
        type: Number,
        default : 0,
    }
}, {timestamps : true})

const Post = mongoose.model('Post', postSchema)

module.exports = {Post}