const mongoose = require('mongoose')

const contestSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    createdOnDate:{
        type: Date,
        required: true,
        default: Date.now
    }
},
{
    versionKey: false
});

module.exports = mongoose.model('Contest', contestSchema)