const express = require('express')
const router = express.Router()
const Prize = require('../models/prize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Contest = require('../models/contest')

// All prizes
router.get('/', async (req, res) => {
    try {
        const prizes = await Prize.find()
        res.json(prizes)
    } catch (err) {
        res.status(400).json({message: "Bad request."})
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

    const contests = await Contest.find()
    const contest = contests.filter(contest => contest.id == prize.fk_contestid && contest.fk_userid == prize.fk_userid)
    
    if(contest.toString().length > 0){
        if(prize.title == null || prize.place == null || prize.value == null || prize.about == null || 
            prize.title == "" || prize.place == "" || prize.value == "" || prize.about == ""){
    
            res.status(400).json({message: "You must fill in all required fields in correct formats."})
        }
        else if(prize.title.length < 3 || prize.title.length > 32){
            res.status(400).json({message: "Title must be between 3 and 32 symbols length."})
        }
        else if(prize.place.toString().length != 1){
            res.status(400).json({message: "Place must be a valid number."})
        }
        else if(prize.value.toString().length > 6){
            res.status(400).json({message: "Value must be a valid number."})
        }
        else if(prize.about.length > 250){
            res.status(400).json({message: "About field must be max 250 symbols length."})
        }
        else{
            try {
                const newPrize = await prize.save()
                res.status(201).json({message: "New prize added successfully."})
                
            } catch (err) {
                res.status(400).json({message: "Wrong input format."})
            }
        }
    }
    else{
        res.status(400).json({message: "Contest id must be valid and has to be created by the same user."})
    }
})

// Update prize
router.patch('/:id', authenticateToken, getPrize, requireAdmin, requireSameUser, async (req, res) => {
    try {
        if(req.body.title == "" || req.body.place == "" || req.body.value == "" || req.body.about == ""){
            res.status(400).json({message: "You must fill in all required fields."})
        }
        if(req.body.title != null){
            if(req.body.title.length < 3 || req.body.title.length > 32){
                res.status(400).json({message: "Title must be between 3 and 32 symbols length."})
            }
            else{
                res.prize.title = req.body.title
            }
        }
        if(req.body.place != null){
            if(req.body.place.toString().length != 1 || req.body.place.length != 1){
                res.status(400).json({message: "Place must be a valid number."})
            }
            else{
                res.prize.place = req.body.place
            }   
        }
        if(req.body.value != null){
            if(req.body.value.toString().length > 6 || req.body.value.length > 6){
                res.status(400).json({message: "Value must be a valid number."})
            }
            else{
                res.prize.value = req.body.value
            }
        }
        if(req.body.about != null){
            if(req.body.about.length > 250){
                res.status(400).json({message: "About field must be max 250 symbols length."})
            }
            else{
                res.prize.about = req.body.about
            }
        }
        const updatedPrize = await res.prize.save()
        res.status(200).json(updatedPrize) 
    } catch (err) {
        res.status(400)
    }
})

// Delete prize
router.delete('/:id', authenticateToken, getPrize, requireAdmin, requireSameUser, async (req, res) => {
    try {
        await res.prize.remove()
        res.status(200).json({message: "Prize deleted successfully."})
    } catch (err) {
        res.status(403).json({message: err.message})
    }
})

async function getPrize(req, res, next){
    let prize
    try{
        prize = await Prize.findById(req.params.id)
        if(prize == null){
            return res.status(404).json({message: "Prize not found."})
        }
    } catch (err) {
        return res.status(404).send({message: "Prize not found."})
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
            return res.sendStatus(401)
        req.user = user
        
        next()
    })
}

function requireAdmin(req, res, next) {
    if (req.user.admin == false) {
        res.status(403).json({message: "Permission denied. You have to be admin."});
    }
    else {
        next();
    }
};

function requireSameUser(req, res, next) {
    if (req.user._id != res.prize.fk_userid) {
        res.status(403).json({message: "Permission denied. You have to be same user."});
    }
    else {
        next();
    }
};

module.exports = router