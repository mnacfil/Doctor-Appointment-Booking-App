const createTokenUser = require('./createTokenUser')
const {isTokenValid, attachCookiesToResponse} = require('./jwt')
const sendEmailVerification = require('./EmailVerification/sendEmailVerification')

module.exports = {
    createTokenUser,
    sendEmailVerification,
    isTokenValid,
    attachCookiesToResponse
}