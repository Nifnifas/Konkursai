const mongoose = require('mongoose')

const contestSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: false
    },
    author:{
        type: String,
        required: true
    },
    createdOnDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    fk_userid:{
        type: String,
        required: true
    }
},
{
    versionKey: false
});

module.exports = mongoose.model('Contest', contestSchema)