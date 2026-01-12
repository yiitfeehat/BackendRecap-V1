const mongoose = require('mongoose');


const authSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String,
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('User', authSchema)