require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', (error) => console.log('Connected to database'))

app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const contestRouter = require('./routes/contests')
app.use('/contests', contestRouter)

const formRouter = require('./routes/forms')
app.use('/forms', formRouter)

const prizeRouter = require('./routes/prizes')
app.use('/prizes', prizeRouter)

app.listen(3000, () => console.log('Server Started'))