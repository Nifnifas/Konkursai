require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', (error) => console.log('Connected to database'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('view-engine', 'ejs')

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const contestRouter = require('./routes/contests')
app.use('/contests', contestRouter)

const formRouter = require('./routes/forms')
app.use('/forms', formRouter)

const prizeRouter = require('./routes/prizes')
app.use('/prizes', prizeRouter)

app.listen(3000, () => console.log('Server 3000 Started'))
app.listen(4000, () => console.log('Server 4000 Started'))