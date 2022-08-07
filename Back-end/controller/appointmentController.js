const Appointment = require('../model/Appointment')
const CustomError = require('../error')
const {StatusCodes} = require('http-status-codes')
const Doctor = require('../model/Doctor')
const {sendAppointmentToDoctor, accessPermission} = require('../util')


const createAppointment = async (req, res) => {
    const {overview, time, doctor: doctorId} = req.body
    const getDoctor = await Doctor.findOne({_id: doctorId})
    if(!getDoctor) {
        throw new CustomError.NotFoundError('Doctor not found!')
    }
    const clientTime = Number(time.split(':')[0])
    const doctorTime = getDoctor.schedule.split(' ')
    const shiftStart = parseInt(doctorTime[0].split(':')[0])
    const shiftEnd = parseInt(doctorTime[3].split(':')[0])
    // setup a condtion to see if the time is available on doctor's time
    if(clientTime < shiftStart || clientTime > shiftEnd) {
        throw new CustomError.BadRequestError('Doctor is not available at that time')
    }

    // setup a condition to restrict 1 appointment per doctor at same time
    const appointmentAlreadyBook = await Appointment.findOne({_id: req.user.userId})
    if(appointmentAlreadyBook) {
        throw new CustomError.BadRequestError('You already book appointment, cannot book twice')
    }

    const appointment = await Appointment.create({
        overview,
        time,
        user: req.user.userId,
        doctor: doctorId
    })

    // send email to doctor
    sendAppointmentToDoctor({
        name: getDoctor.firstName,
        email: getDoctor.email,
        overview,
        time
    })
    // on client side, setup a functionality to know if doctor approve it or not
    res.status(StatusCodes.CREATED).json({msg: "Book appointment success, Please wait to your email for doctor's confirmation"})
}

const getAllAppointment = async (req, res) => {
    const appointments = await Appointment.find({}).populate({
        path: 'doctor',
        select: 'firstName lastName specialization feePerConsultation workPlace'
    }).populate({
        path: 'user',
        select: 'firstName lastName contactNumber address'
    })
    res.status(StatusCodes.OK).json({appointments, list: appointments.length})
}

const getSingleAppointment = async (req, res) => {
    const appointment = await Appointment.findOne({_id: req.params.id})
    if(!appointment) {
        throw new CustomError.NotFoundError('No appointment found!')
    }
    res.status(StatusCodes.OK).json({appointment})
}

// doctor approval
const approvedAppointment = async (req, res) => {
    const appointment = await Appointment.findOne({_id: req.params.id, user: req.user.userId})
    if(!appointment) {
        throw new CustomError.NotFoundError('No appointment found!')
    }
    accessPermission(req.user, appointment.user)
    appointment.status = "approved"
    appointment.approveDate = Date.now()
    // send approved conformation to client

    res.status(StatusCodes.OK).json({appointment})
}


const updateAppointment = async (req, res) => {
    const appointment = await Appointment.findOne({_id: req.params.id})
    if(!appointment) {
        throw new CustomError.NotFoundError('No appointment found!')
    }
    // only the client who create appointment can edit or Admin
    accessPermission(req.user, appointment.user)

    appointment.overview = req.body.overview
    appointment.time = req.body.time
    await appointment.save()

    res.status(StatusCodes.OK).json({appointment})
}

const deleteAppointment = async (req, res) => {
    const appointment = await Appointment.findOne({_id: req.params.id})
    if(!appointment) {
        throw new CustomError.NotFoundError('No appointment found!')
    }
    accessPermission(req.user, appointment.user)
    await appointment.remove()
    res.status(StatusCodes.OK).json({message: 'Appointment Deleted!'})
}

module.exports = {
    createAppointment,
    getAllAppointment,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment
}