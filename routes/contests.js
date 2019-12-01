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
        res.status(500).json({message: err.message})
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

    try {
        const newContest = await contest.save()
        res.status(201).json(newContest)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update contest
router.patch('/:id', getContest, authenticateToken, requireAdmin, requireSameUser, async (req, res) => {
    if(req.body.title != null){
        res.contest.title = req.body.title
    }
    if(req.body.author != null){
        res.contest.author = req.body.author
    }
    try {
        const updatedContest = await res.contest.save()
        res.json(updatedContest)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Delete contest
router.delete('/:id', getContest, authenticateToken, requireAdmin, requireSameUser, async (req, res) => {
    try {
        await res.contest.remove()
        res.json({message: 'Contest deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getContest(req, res, next){
    let contest
    try{
        contest = await Contest.findById(req.params.id)
        if(contest == null){
            return res.status(404).json({message: 'Cannot find contest'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
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
    if (req.user._id != res.contest.fk_userid) {
        res.json({message: 'Permission denied. You have to be same user.'});
    }
    else {
        next();
    }
};

module.exports = router