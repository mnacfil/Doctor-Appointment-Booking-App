const Appointment = require('../model/appointment')
const CustomError = require('../error')
const {StatusCodes} = require('http-status-codes')
const Doctor = require('../model/Doctor')


const createAppointment = async (req, res) => {
    const {overview, time, doctor: doctorId} = req.body
    const getDoctor = await Doctor.findOne({_id: doctorId})

    console.log(getDoctor.schedule)
    console.log(time)
    // setup a condtion to see if the time is available on doctor's time
    // const appointment = await Appointment.create({
    //     overview,
    //     time,
    //     user: req.user.userId,
    // })

    // send email to doctor
    res.status(StatusCodes.CREATED).json({getDoctor})
}

const getAllAppointment = async (req, res) => {
    res.send('get all appointment')
}

const getSingleAppointment = async (req, res) => {
    res.send('get single appointment')
}

const updateAppointment = async (req, res) => {
    res.send('update appointment')
}

const deleteAppointment = async (req, res) => {
    res.send('delete appointment')
}

module.exports = {
    createAppointment,
    getAllAppointment,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment
}