const express = require('express')
const router = express.Router()
const Contest = require('../models/contest')

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
router.post('/', async (req, res) => {
    const contest = new Contest({
        title: req.body.title,
        author: req.body.author
    })

    try {
        const newContest = await contest.save()
        res.status(201).json(newContest)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update contest
router.patch('/:id', getContest, async (req, res) => {
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
router.delete('/:id', getContest, async (req, res) => {
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

module.exports = router