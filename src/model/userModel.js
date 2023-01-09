const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: String,
        reuired: true,
        min: 10,
        max: 10
    },
    Age: {
        type: Number,
        reuired: true,
        max: 2
    },
    Pincode: {
        type: Number,
        required: true,
        min: 6,
        max: 6
    },
    AadharNumber: {
        type: Number,
        required: true,
        min: 16,
        max: 16
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 