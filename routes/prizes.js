const express = require('express')
const router = express.Router()
const Prize = require('../models/prize')

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
router.post('/', async (req, res) => {
    const prize = new Prize({
        title: req.body.title,
        place: req.body.place,
        value: req.body.value,
        about: req.body.about
    })

    try {
        const newPrize = await prize.save()
        res.status(201).json(newPrize)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update prize
router.patch('/:id', getPrize, async (req, res) => {
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
router.delete('/:id', getPrize, async (req, res) => {
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

module.exports = router