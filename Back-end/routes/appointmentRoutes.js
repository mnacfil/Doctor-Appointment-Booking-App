const express = require('express')
const router = express.Router()

const {
    createAppointment,
    getAllAppointment,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controller/appointmentController')

const {authenticateUser, authorizePermission} = require('../middleware/authentication')

router.route('/').
    get(authenticateUser, getAllAppointment).
    post(authenticateUser, createAppointment)

router.route('/:id').
    get(authenticateUser, getSingleAppointment).
    patch(authenticateUser, updateAppointment).
    delete(authenticateUser, deleteAppointment)

module.exports = router