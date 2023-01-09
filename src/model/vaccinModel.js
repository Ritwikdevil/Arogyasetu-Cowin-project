const mongoose = require('mongoose');

const CowinSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    FirstDoseVaccination: {
        type: String,
        default: null
    },
    Dose1Slot: String,
    SecondDoseVaccination: {
        type: String,
        default: null
    },
    Dose2Slot: String,

    timer: String
}, { timestamps: true });

module.exports = mongoose.model('Cowin', CowinSchema); 