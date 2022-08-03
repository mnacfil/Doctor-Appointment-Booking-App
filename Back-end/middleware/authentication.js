const {StatusCodes} = require('http-status-codes')
const {isTokenValid, attachCookiesToResponse} = require('../util')
const Token = require('../model/Token')
const CustomError = require('../error')

const authenticateUser = async (req, res, next) => {
    const {accessJWT, refreshJWT} = req.signedCookies
    try {
        if(accessJWT) {
            const {user: {name, email, userId}}= isTokenValid(accessJWT)
            req.user = {name, email, userId}
            return next() // pass to next middleware (routes that need to authenticate user)
        }
    // if the accessJWT expires, use refresh token to allow user to proceed, and refresh
    // new sets of JWT
        const payload = isTokenValid(refreshJWT)
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: refreshToken
        })
        // check if existing token is null or isValid is false(not valid)
        if(!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError('Unauthenticated Error')
        }
        attachCookiesToResponse({res, user: payload.user, refreshToken})
        req.user = payload.user
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Unauthenticated Error sdsd')
    }
}

// Sets to only admin can access this resources
const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes('admin')) {
            throw new CustomError.UnauthorizedError('You are not authorized to access this resources')
        }
        next() // pass to route where admin only can access.
    }
}

module.exports = {
    authenticateUser,
    authorizePermission
}