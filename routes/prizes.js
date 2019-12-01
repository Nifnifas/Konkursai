const express = require('express')
const router = express.Router()
const Prize = require('../models/prize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// All prizes
router.get('/', async (req, res) => {
    try {
        const prizes = await Prize.find()
        res.json(prizes)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// One prize
router.get('/:id', getPrize, (req, res) => {
    res.json(res.prize)
})

// Create prize
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const prize = new Prize({
        title: req.body.title,
        place: req.body.place,
        value: req.body.value,
        about: req.body.about,
        fk_contestid: req.body.fk_contestid,
        fk_userid: req.user._id
    })

    try {
        const newPrize = await prize.save()
        res.status(201).json(newPrize)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update prize
router.patch('/:id', getPrize, authenticateToken, requireAdmin, requireSameUser, async (req, res) => {
    if(req.body.title != null){
        res.prize.title = req.body.title
    }
    if(req.body.place != null){
        res.prize.place = req.body.place
    }
    if(req.body.value != null){
        res.prize.value = req.body.value
    }
    if(req.body.about != null){
        res.prize.about = req.body.about
    }
    try {
        const updatedPrize = await res.prize.save()
        res.json(updatedPrize)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Delete prize
router.delete('/:id', getPrize, authenticateToken, requireAdmin, requireSameUser, async (req, res) => {
    try {
        await res.prize.remove()
        res.json({message: 'Prize deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getPrize(req, res, next){
    let prize
    try{
        prize = await Prize.findById(req.params.id)
        if(prize == null){
            return res.status(404).json({message: 'Cannot find prize'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.prize = prize
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

function requireAdmin(req, res, next) {
    if (req.user.admin == false) {
        res.json({message: 'Permission denied. You have to be admin.'});
    }
    else {
        next();
    }
};

function requireSameUser(req, res, next) {
    if (req.user._id != res.prize.fk_userid) {
        res.json({message: 'Permission denied. You have to be same user.'});
    }
    else {
        next();
    }
};

module.exports = router