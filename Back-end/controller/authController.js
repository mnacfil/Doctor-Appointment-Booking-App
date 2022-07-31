const User = require('../model/User')
const Token = require('../model/Token')
const CustomError = require('../error')
const {createTokenUser, sendEmailVerification, attachCookiesToResponse} = require('../util')
const crypto = require('crypto')
const {StatusCodes} = require('http-status-codes')

const register = async(req, res) => {
    const {firstName, lastName, email, password} = req.body

    const emailAlreadyExist = await User.findOne({email})
    if(emailAlreadyExist) {
        throw new CustomError.BadRequestError('email already exist! try another value')
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user'

    let verificationToken = crypto.randomBytes(40).toString('hex')

    const user = await User.create({firstName, lastName, email, password, role, verificationToken})

    // const tokenUser = createTokenUser(user)

    const origin = 'http://localhost:3000'
    // send email verification
    await sendEmailVerification({
        name: user.firstName, 
        email: user.email, 
        verificationToken: user.verificationToken,
        origin, 
    })
    res.status(StatusCodes.CREATED).json({message: 'Thank you for registry, a verification link sent to your email.'})
}

const verifyEmail = async(req, res) => {
    const {email, verificationToken} = req.body
    if(!email || !verificationToken) {
        throw new CustomError.UnauthorizedError('Verification failed!')
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new CustomError.UnauthorizedError('Verification failed!')
    }
    if(user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthorizedError('Verification failed!')
    }
    // everything went well
    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ""

    await user.save()
    res.status(StatusCodes.OK).json({message: 'Email Confirmed! Please go to login'})
}

const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new CustomError.UnauthorizedError('Wrong credentials! email or password is incorrect')
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect) {
        console.log('wrong password')
        throw new CustomError.UnauthorizedError('Wrong credentials! email or password is incorrect')
    }
    if(!user.isVerified) {
        throw new CustomError.UnauthorizedError('Please verified your email before login.')
    }
    const tokenUser = createTokenUser(user)
    let refreshToken = ""

    const existingToken = await Token.findOne({user: user_id})
    if(existingToken) {
        const {isValid} = existingToken
        if(!isValid) {
            throw new CustomError.UnauthorizedError('Invalid credentials, Please try again later')
        }
        refreshToken = existingToken.refreshToken
        // attach cookie to response
        attachCookiesToResponse({res, user: tokenUser, refreshToken})
        res.status(StatusCodes.OK).json({user: tokenUser})
        return
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    const ip = req.ip
    const userAgent = req.headers['user-agent']
    const userToken = {ip, userAgent, refreshToken, user: user._id}
    // create user token in database which will use, if he login
    await Token.create(userToken)

    attachCookiesToResponse({res, user: tokenUser, refreshToken})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

const logout = async(req, res) => {
    res.send('logout')
}

const forgotPassword = async(req, res) => {
    res.send('forgotPassword')
}

const resetPassword = async(req, res) => {
    res.send('resetPassword')
}

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
}