const PORT = 5000
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

const mongoose = require('mongoose')
const config = require('./config/key')

const connect = mongoose.connect(config.mongoURI, 
        {
            useNewUrlParser: true, useUnifiedTopology: true,
            useCreateIndex: true, useFindAndModify: false
        })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.log(err))

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')



app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/uploads', express.static('uploads'))

app.use('/api/user', require('./routes/user'))
app.use('/api/post', require('./routes/post'))
app.use('/api/vote', require('./routes/vote'))
app.use('/api/like', require('./routes/like'))
app.use('/api/comment', require('./routes/comment'))


app.listen(PORT, ()=>{
    console.log(`Server Listening on ${PORT}`)
})