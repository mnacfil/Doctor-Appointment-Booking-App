const mongoose = require('mongoose')
// diagnose
// time
// name,
// age
// email
// address
// user
// doctor

const AppointmentSchema = new mongoose.Schema({
    overview: {
        type: String,
        required: [true, 'Please provide brief overview']
    },
    time: {
        type: String,
        required: [true, 'Please provide time']
    },
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

}, {timestamps: true})

module.exports = mongoose.model('Appointment', AppointmentSchema)

// To do
// the user send appointment to doctor (thru email)
// setup functionality where is if the time and date of appointment is not available time for doctor
// then the doctor can view and accept the appointment
// send verification email