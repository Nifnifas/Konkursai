const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    city:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    about:{
        type: String,
        required: true
    },
},
{
    versionKey: false
});

module.exports = mongoose.model('Form', formSchema)