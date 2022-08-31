const express = require('express')
const router = express.Router()

const {authenticateUser, authorizePermission} = require('../middleware/authentication')

const {
    getAllDoctor,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    createDoctorAccount
} = require('../controller/doctorController')

router.route('/').
    get( getAllDoctor).
    post(createDoctorAccount)
    
router.route('/:id').
    get( getSingleDoctor).
    patch( updateDoctor).
    delete( deleteDoctor)

module.exports = router