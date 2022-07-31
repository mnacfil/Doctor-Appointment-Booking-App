const express = require('express')
const router = express.Router()

const {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../controller/authController')

router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router