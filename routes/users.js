require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// All users
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// One user
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

// Create user
router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin
    })

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        user.password = hashedPassword
        const newUser = await user.save()
        res.status(201).json(newUser)
        //res.redirect('/login')
    } catch (err) {
        res.status(400).json({message: err.message})
        //res.redirect('/register')
    }
})

// Authenticate user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find()
        const user = users.filter(user => user.email == req.user.email)
        res.send(user)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Login user
router.post('/login', async (req, res) => {
    const users = await User.find()
    const user = users.find(user => user.email == req.body.email)
    if(user == null){
        return res.status(400).send('Cannot find user')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)) {
            //res.send('Success')

            const accessToken = generateAccessToken(user)
            // const refreshToken = generateRefreshToken(user)
            //refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken })
        } else {
            res.send('Permission denied')
        }
    } catch {
        res.status(500).send('Error 500')
    }
})

// Update user
router.patch('/:id', getUser, authenticateToken, requireSameUser, async (req, res) => {
    if(req.body.name != null){
        res.user.name = req.body.name
    }
    if(req.body.surname != null){
        res.user.surname = req.body.surname
    }
    if(req.body.age != null){
        res.user.age = req.body.age
    }
    if(req.body.email != null){
        res.user.email = req.body.email
    }
    if(req.body.password != null){
        res.user.password = req.body.password
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Delete user
router.delete('/:id', getUser, authenticateToken, requireAdmin, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'User deleted.'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

function requireAdmin(req, res, next) {
    if (req.user.admin == false) {
        res.json({message: 'Permission denied. You have to be admin.'});
    }
    else {
        next();
    }
};

function requireSameUser(req, res, next) {
    if (req.user._id != res.user.id) {
        res.json({message: 'Permission denied. You have to be same user.'});
    }
    else {
        next();
    }
};

// Gets user by id
async function getUser(req, res, next){
    let user
    try{
        user = await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({message: 'Cannot find user'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}

// Authenticates user by token
function authenticateToken (req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null)
        return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err)
            return res.sendStatus(403)
        req.user = user
        
        next()
    })
}

function generateAccessToken(user){
    return jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '180s'})
}

function generateRefreshToken(user){
    return jwt.sign(user.toObject(), process.env.REFRESH_TOKEN_SECRET)
}

module.exports = router