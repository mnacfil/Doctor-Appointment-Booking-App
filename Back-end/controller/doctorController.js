const Doctor = require('../model/Doctor');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../error');

const createDoctorAccount = async (req, res) => {
    const doctor = await Doctor.create(req.body)
    res.status(StatusCodes.CREATED).json({user : doctor})
}

// public
const getAllDoctor = async (req, res) => {
    const doctors = await Doctor.find({});
    res.status(StatusCodes.OK).json({doctors, list: doctors.length});
}

// public
const getSingleDoctor = async (req, res) => {
    const {id: doctorId} = req.params;
    const doctor = await Doctor.findOne({_id: doctorId});
    if(!doctor) {
        throw new CustomError.NotFoundError('No doctor found!');
    }
    res.status(StatusCodes.OK).json({user: doctor});
}

const updateDoctor = async (req, res) => {
    const {id: doctorId} = req.params;
    const doctor = await Doctor.findOneAndUpdate({_id: doctorId}, req.body, {
        new: true,
        runValidators: true
    });
    if(!doctor) {
        throw new CustomError.NotFoundError('No doctor found!');
    }
    res.status(StatusCodes.OK).json({user: doctor});
}

const deleteDoctor = async (req, res) => {
    const {id: doctorId} = req.params;
    const doctor = await Doctor.findOneAndDelete({_id: doctorId});
    if(!doctor) {
        throw new CustomError.NotFoundError('No doctor found!');
    }
    res.status(StatusCodes.OK).json({msg: 'Account deleted!'});
}

// TO DO
// Appointment 
// how to change the status of doctor by admin

module.exports = {
    getAllDoctor,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    createDoctorAccount
}