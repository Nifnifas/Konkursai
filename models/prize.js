const mongoose = require('mongoose')

const prizeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    place:{
        type: Number,
        required: true
    },
    value:{
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

module.exports = mongoose.model('Prize', prizeSchema)