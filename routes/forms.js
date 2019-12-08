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
        res.status(400).json({message: "Bad request."})
    }
})

// One form
router.get('/:id', authenticateToken, getForm, requireAdminOrSameUser,  (req, res) => {
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

    if(form.city == null || form.address == null || form.phone == null || form.about == null || 
        form.city == "" || form.address == "" || form.phone == "" || form.about == ""){

        res.status(400).json({message: "You must fill in all required fields in correct formats."})
    }
    else if(form.city.length < 4 || form.city.length > 32){
        res.status(400).json({message: "City must be between 4 and 32 symbols length."})
    }
    else if(form.address.length < 4 || form.address.length > 32){
        res.status(400).json({message: "Address must be between 4 and 32 symbols length."})
    }
    else if(form.phone.toString().length != 11){
        res.status(400).json({message: "Phone number must start with '370' format."})
    }
    else if(form.about.length > 250){
        res.status(400).json({message: "About field must be max 250 symbols length."})
    }
    else{
        try {
            const newForm = await form.save()
            res.status(201).json({message: "New form added successfully."})
            
        } catch (err) {
            res.status(400).json({message: "Wrong input format."})
        }
    }
})

// Update form
router.patch('/:id', authenticateToken, getForm, requireSameUser, async (req, res) => {
    try {
        if(req.body.city == "" || req.body.address == "" || req.body.phone == "" || req.body.about == ""){
            res.status(400).json({message: "You must fill in all required fields."})
        }
        if(req.body.city != null){
            if(req.body.city.length < 4 || req.body.city.length > 32){
                res.status(400).json({message: "City must be between 4 and 32 symbols length."})
            }
            else{
                res.form.city = req.body.city
            }
        }
        if(req.body.address != null){
            if(req.body.address.length < 4 || req.body.address.length > 32){
                res.status(400).json({message: "Address must be between 4 and 32 symbols length."})
            }
            else{
                res.form.address = req.body.address
            }   
        }
        if(req.body.phone != null){
            if(req.body.phone.toString().length != 11){
                res.status(400).json({message: "Phone number must start with '370' format."})
            }
            else{
                res.form.phone = req.body.phone
            }
        }
        if(req.body.about != null){
            if(req.body.about.length > 250){
                res.status(400).json({message: "About field must be max 250 symbols length."})
            }
            else{
                res.form.about = req.body.about
            }
        }
        const updatedForm = await res.form.save()
        res.status(200).json(updatedForm) 
    } catch (err) {
        res.status(400)
    }
})

// Delete form
router.delete('/:id', authenticateToken, getForm, requireSameUser,  async (req, res) => {
    try {
        await res.form.remove()
        res.status(200).json({message: "Form deleted successfully."})
    } catch (err) {
        res.status(403).json({message: err.message})
    }
})

async function getForm(req, res, next){
    let form
    try{
        form = await Form.findById(req.params.id)
        if(form == null){
            return res.status(404).json({message: "Form not found."})
        }
    } catch (err) {
        return res.status(404).send({message: "Form not found."})
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
    if (req.user._id != res.form.fk_userid) {
        res.status(403).json({message: "Permission denied. You have to be same user."});
    }
    else {
        next();
    }
};

function requireAdminOrSameUser(req, res, next) {
    if (req.user._id == res.form.fk_userid || req.user.admin == true) {
        next();
    }
    else {
        res.status(403).json({message: "Permission denied. You have to be same user or admin."});
    }
};

module.exports = router