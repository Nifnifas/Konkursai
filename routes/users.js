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
        res.status(400).json({message: "Bad request."})
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

    if(user.password == null || user.name == null || user.surname == null || user.age == null || user.email == null || user.admin == null || 
        user.password == "" || user.name == "" || user.surname == "" || user.age == "" || user.email == ""){

        res.status(400).json({message: "You must fill in all required fields."})
    }
    else if(user.name.length < 4 || user.name.length > 32){
        res.status(400).json({message: "Name must be between 4 and 32 symbols length."})
    }
    else if(user.surname.length < 3 || user.surname.length > 32){
        res.status(400).json({message: "Surname must be between 3 and 32 symbols length."})
    }
    else if(user.age.toString().length < 1 || user.age.toString().length > 2){
        res.status(400).json({message: "Age must be a valid number."})
    }
    else if(user.email.length < 8 || user.email.length > 48){
        res.status(400).json({message: "Email must be between 8 and 48 symbols length."})
    }
    else if(user.password.length < 8 || user.password.length > 32){
        res.status(400).json({message: "Password must be between 8 and 32 symbols length."})
    }
    else{
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            user.password = hashedPassword
            const newUser = await user.save()
            res.status(201).json({message: "New user registered successfully."})
            //res.redirect('/login')
        } catch (err) {
            res.status(400).json({message: "Wrong input format."})
            //res.redirect('/register')
        }
    }
})

// Authenticate user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find()
        const user = users.filter(user => user.email == req.user.email)
        res.send(user)
    } catch (err) {
        res.sendStatus(404)
    }
})

// Login user
router.post('/login', async (req, res) => {
    const users = await User.find()
    const user = users.find(user => user.email == req.body.email)
    if(user == null){
        return res.status(404).send({message: "Cannot find user."})
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user)
            res.json({ accessToken: accessToken })
        } else {
            res.status(401).send({message: "Permission denied. Wrong password."})
        }
    } catch {
        res.status(400).send({message: "Bad request."})
    }
})

// Update user
router.patch('/:id', authenticateToken, getUser, requireSameUser, async (req, res) => {
    try {
        if(req.body.password == "" || req.body.name == "" || req.body.surname == "" || req.body.age == "" || req.body.email == ""){
            res.status(400).json({message: "You must fill in all required fields in correct formats."})
        }
        if(req.body.name != null){
            if(req.body.name.length < 4 || req.body.name.length > 32){
                res.status(400).json({message: "Name must be between 4 and 32 symbols length."})
            }
            else{
                res.user.name = req.body.name
            }
        }
        if(req.body.surname != null){
            if(req.body.surname.length < 3 || req.body.surname.length > 32){
                res.status(400).json({message: "Surname must be between 3 and 32 symbols length."})
            }
            else{
                res.user.surname = req.body.surname
            }   
        }
        if(req.body.age != null){
            if(req.body.age.toString().length < 1 || req.body.age.toString().length > 2){
                res.status(400).json({message: "Age must be a valid number."})
            }
            else{
                res.user.age = req.body.age
            }
        }
        if(req.body.email != null){
            if(req.body.email.length < 8 || req.body.email.length > 48){
                res.status(400).json({message: "Email must be between 8 and 48 symbols length."})
            }
            else{
                res.user.email = req.body.email
            }
        }
        if(req.body.password != null){
            if(req.body.password.length < 8 || req.body.password.length > 32){
                res.status(400).json({message: "Password must be between 8 and 32 symbols length."})
            }
            else{
                res.user.password = req.body.password
            }
        }
        const updatedUser = await res.user.save()
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(400)
    }
})

// Delete user
router.delete('/:id', authenticateToken, getUser, requireAdmin, async (req, res) => {
    try {
        await res.user.remove()
        res.status(200).json({message: "User deleted successfully."})
    } catch (err) {
        res.status(403).json({message: err.message})
    }
})

function requireAdmin(req, res, next) {
    if (req.user.admin == false) {
        res.status(403).json({message: "Permission denied. You have to be admin."});
    }
    else {
        next();
    }
};

function requireSameUser(req, res, next) {
    if (req.user._id != res.user.id) {
        res.status(403).json({message: "Permission denied. You have to be same user."});
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
            return res.status(404).send({message: "User not found."})
        }
    } catch (err) {
        return res.status(404).send({message: "User not found."})
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
            return res.sendStatus(401)
        req.user = user
        
        next()
    })
}

function generateAccessToken(user){
    return jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '360s'})
}

module.exports = router