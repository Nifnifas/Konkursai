require('dotenv').config()
const express = require('express')
const router = express.Router()
const Form = require('../models/form')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// All forms
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const forms = await Form.find()
        res.json(forms)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// One form
router.get('/:id', authenticateToken, requireAdmin, getForm, (req, res) => {
    res.json(res.form)
})

// Create form
router.post('/', authenticateToken, async (req, res) => {
    const form = new Form({
        city: req.body.city,
        address: req.body.address,
        phone: req.body.phone,
        about: req.body.about,
        fk_userid: req.user._id
    })

    try {
        const newForm = await form.save()
        res.status(201).json(newForm)
        
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update form
router.patch('/:id', getForm, authenticateToken, requireSameUser, async (req, res) => {
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
router.delete('/:id', getForm, authenticateToken, requireSameUser,  async (req, res) => {
    try {
        await res.form.remove()
        res.json({message: 'Form deleted'})
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
    if (req.user._id != res.form.fk_userid) {
        res.json({message: 'Permission denied. You have to be same user.'});
    }
    else {
        next();
    }
};

module.exports = router