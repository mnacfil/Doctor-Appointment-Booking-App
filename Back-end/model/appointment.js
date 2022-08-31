const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    overview: {
        type: String,
        required: [true, 'Please provide brief overview']
    },
    time: {
        type: String,
        required: [true, 'Please provide time']
    },
    status: {
        type:String,
        enum: ['pending', 'declined', 'approved'],
        default: 'pending'
    },
    approveDate: Date,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
        required: true
    }

}, {timestamps: true});

AppointmentSchema.index({user: 1, doctor: 1}, {unique: true});

module.exports = mongoose.model('Appointment', AppointmentSchema);