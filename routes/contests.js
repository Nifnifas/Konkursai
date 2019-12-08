const express = require('express')
const router = express.Router()
const Contest = require('../models/contest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// All contests
router.get('/', async (req, res) => {
    try {
        const contests = await Contest.find()
        res.json(contests)
    } catch (err) {
        res.status(400).json({message: "Bad request."})
    }
})

// One contest
router.get('/:id', getContest, (req, res) => {
    res.json(res.contest)
})

// Create contest
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const contest = new Contest({
        title: req.body.title,
        about: req.body.about,
        author: req.user.name + " " + req.user.surname,
        fk_userid: req.user._id
    })

    if(contest.title == null || contest.about == null || 
        contest.title == "" || contest.about == ""){

        res.status(400).json({message: "You must fill in all required fields in correct formats."})
    }
    else if(contest.title.length < 3 || contest.title.length > 32){
        res.status(400).json({message: "Title must be between 3 and 32 symbols length."})
    }
    else if(contest.about.length < 4 || contest.about.length > 32){
        res.status(400).json({message: "About must be between 4 and 32 symbols length."})
    }
    else{
        try {
            const newContest = await contest.save()
            res.status(201).json({message: "New contest added successfully."})
            
        } catch (err) {
            res.status(400).json({message: "Wrong input format."})
        }
    }
})

// Update contest
router.patch('/:id', authenticateToken, getContest, requireAdmin, requireSameUser, async (req, res) => {
    try {
        if(req.body.title == "" || req.body.about == ""){
            res.status(400).json({message: "You must fill in all required fields."})
        }
        if(req.body.title != null){
            if(req.body.title.length < 3 || req.body.title.length > 32){
                res.status(400).json({message: "Title must be between 3 and 32 symbols length."})
            }
            else{
                res.contest.title = req.body.title
            }
        }
        if(req.body.about != null){
            if(req.body.about.length > 250){
                res.status(400).json({message: "About field must be max 250 symbols length."})
            }
            else{
                res.contest.about = req.body.about
            }   
        }
        const updatedContest = await res.contest.save()
        res.status(200).json(updatedContest) 
    } catch (err) {
        res.status(400)
    }
})

// Delete contest
router.delete('/:id', authenticateToken, getContest, requireAdmin, requireSameUser, async (req, res) => {
    try {
        await res.contest.remove()
        res.status(200).json({message: "Contest deleted successfully."})
    } catch (err) {
        res.status(403).json({message: err.message})
    }
})

async function getContest(req, res, next){
    let contest
    try{
        contest = await Contest.findById(req.params.id)
        if(contest == null){
            return res.status(404).json({message: "Contest not found."})
        }
    } catch (err) {
        return res.status(404).send({message: "Contest not found."})
    }
    res.contest = contest
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
    if (req.user._id != res.contest.fk_userid) {
        res.status(403).json({message: "Permission denied. You have to be same user."});
    }
    else {
        next();
    }
};

module.exports = router