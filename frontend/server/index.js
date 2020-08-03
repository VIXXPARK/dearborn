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

app.use('/api/user', require('./routes/user'))
app.use('/api/product', require('./routes/product'))


app.listen(PORT, ()=>{
    console.log(`Server Listening on ${PORT}`)
})