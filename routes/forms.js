const express = require('express')
const router = express.Router()
const Form = require('../models/form')

// All forms
router.get('/', async (req, res) => {
    try {
        const forms = await Form.find()
        res.json(forms)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// One form
router.get('/:id', getForm, (req, res) => {
    res.json(res.form)
})

// Create form
router.post('/', async (req, res) => {
    const form = new Form({
        city: req.body.city,
        address: req.body.address,
        phone: req.body.phone,
        about: req.body.about
    })

    try {
        const newForm = await form.save()
        res.status(201).json(newForm)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update form
router.patch('/:id', getForm, async (req, res) => {
    if(req.body.city != null){
        res.form.city = req.body.city
    }
    if(req.body.address != null){
        res.form.address = req.body.address
    }
    if(req.body.phone != null){
        res.form.phone = req.body.phone
    }
    if(req.body.about != null){
        res.form.about = req.body.about
    }
    try {
        const updatedForm = await res.form.save()
        res.json(updatedForm)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Delete form
router.delete('/:id', getForm, async (req, res) => {
    try {
        await res.form.remove()
        res.json({message: 'Form deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getForm(req, res, next){
    let form
    try{
        form = await Form.findById(req.params.id)
        if(form == null){
            return res.status(404).json({message: 'Cannot find form'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.form = form
    next()
}

module.exports = router