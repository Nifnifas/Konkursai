require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', (error) => console.log('Connected to database'))

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const userRouter = require('./routes/users')
app.use('/api/users', userRouter)

const contestRouter = require('./routes/contests')
app.use('/api/contests', contestRouter)

const formRouter = require('./routes/forms')
app.use('/api/forms', formRouter)

const prizeRouter = require('./routes/prizes')
app.use('/api/prizes', prizeRouter)

//app.listen(3000, () => console.log('Server 3000 Started'))
app.listen(4000, () => console.log('Server 4000 Started'))