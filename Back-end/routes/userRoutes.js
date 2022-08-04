const express = require('express')
const router = express.Router()

const {
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
    myProfile
} = require('../controller/userController')

const {authenticateUser, authorizePermission} = require('../middleware/authentication')

router.route('/').get([authenticateUser, authorizePermission('admin')],getAllUser)

router.route('/myProfile').get(authenticateUser,myProfile)

router.route('/:id').
    get(authenticateUser, getSingleUser).
    patch(authenticateUser, updateUser).
    delete(authenticateUser, deleteUser)

module.exports = router