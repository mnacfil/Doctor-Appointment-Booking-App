const createTokenUser = require('./createTokenUser')
const {isTokenValid, attachCookiesToResponse} = require('./jwt')
const sendEmailVerification = require('./EmailVerification/verify-email/sendEmailVerification')
const sendForgotPasswordLink = require('./EmailVerification/forgot-password/sendForgotPasswordLink')
const {createCryptoToken, createHash} = require('./crypto')

module.exports = {
    createTokenUser,
    sendEmailVerification,
    isTokenValid,
    attachCookiesToResponse,
    sendForgotPasswordLink,
    createCryptoToken,
    createHash

}