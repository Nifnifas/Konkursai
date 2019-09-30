const express = require('express')
const router = express.Router()
const User = require('../models/user')

// All users
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update user
router.patch('/:id', getUser, async (req, res) => {
    if(req.body.name != null){
        res.user.name = req.body.name
    }
    if(req.body.surname != null){
        res.user.surname = req.body.surname
    }
    if(req.body.age != null){
        res.user.age = req.body.age
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Delete user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'User deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

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

module.exports = router