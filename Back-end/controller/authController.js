const User = require('../model/User');
const Token = require('../model/Token');
const CustomError = require('../error');
const {createTokenUser, sendEmailVerification, attachCookiesToResponse, sendForgotPasswordLink, createCryptoToken, createHash} = require('../util');
const {StatusCodes} = require('http-status-codes');

const origin = 'http://localhost:3000'

const register = async(req, res) => {
    const {firstName, lastName, contactNumber, address, email, password} = req.body;

    const emailAlreadyExist = await User.findOne({email})
    if(emailAlreadyExist) {
        throw new CustomError.BadRequestError('email already exist! try another value');
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    let verificationToken = createCryptoToken(40);

    const user = await User.create({
        firstName, 
        lastName, 
        contactNumber,
        address,
        email, 
        password, 
        role, 
        verificationToken
    });

    // send email verification
    await sendEmailVerification({
        name: user.firstName, 
        email: user.email, 
        verificationToken: user.verificationToken,
        origin, 
    })
    res.status(StatusCodes.CREATED).json({message: 'Thank you for registry, a verification link sent to your email.'});
}

const verifyEmail = async(req, res) => {
    const {email, verificationToken} = req.body;
    if(!email || !verificationToken) {
        throw new CustomError.UnauthorizedError('Verification failed!');
    }
    const user = await User.findOne({email});
    if(!user) {
        throw new CustomError.UnauthorizedError('Verification failed!');
    }
    if(user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthorizedError('Verification failed!');
    }
    // everything went well
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = "";

    await user.save();
    res.status(StatusCodes.OK).json({message: 'Email Confirmed! Please go to login'});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email})
    if(!user.isVerified) {
        throw new CustomError.UnauthorizedError('Please verified your email before login.');
    }
    if(!user) {
        throw new CustomError.UnauthorizedError('Wrong credentials! email or password is incorrect');
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthorizedError('Wrong credentials! email or password is incorrect');
    }
    // everything went well
    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await Token.findOne({user: user._id});

    if(existingToken) {
        const {isValid} = existingToken;;
        if(!isValid) {
            throw new CustomError.UnauthorizedError('Invalid credentials, Please try again later');
        }
        refreshToken = existingToken.refreshToken;
        // attach cookie to response
        attachCookiesToResponse({res, user: tokenUser, refreshToken});
        res.status(StatusCodes.OK).json({user: tokenUser});
        return;
    }

    refreshToken = createCryptoToken(40);
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const userToken = {ip, userAgent, refreshToken, user: user._id};
    // create user token in database which will use, if he login
    await Token.create(userToken);
    attachCookiesToResponse({res, user: tokenUser, refreshToken});
    res.status(StatusCodes.OK).json({user: tokenUser});
}

const logout = async(req, res) => {
    // find user token and delete in db
    const userToken = await Token.findOneAndDelete({user: req.user.userId});
    res.cookie('accessToken', "", {
        signed: true,
        expires: new Date(Date.now())
    });
    res.cookie('refreshToken', "", {
        signed: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({message: 'User loggout out!'});
}

const forgotPassword = async(req, res) => {
    const { email } = req.body;
    if(!email) {
        throw new CustomError.BadRequestError('Please provide your email');
    }
    const user = await User.findOne({email});
    if(!user) {
        throw new CustomError.UnauthorizedError('You are are not authorized to change the password');
    }
    let passwordVerificationToken = createCryptoToken(60);
    // attach password reset email, that a user can click to navigate to reset-password
    sendForgotPasswordLink({origin, email: user.email, name: user.firstName, passwordVerificationToken});

    const thiryMinutes = 1000 * 60 * 30;
    const passwordVerificationTokenExpiration = new Date(Date.now() + thiryMinutes);

    user.passwordVerificationToken = createHash(passwordVerificationToken);
    user.passwordVerificationTokenExpiration = passwordVerificationTokenExpiration;
    await user.save();
    
    res
    .status(StatusCodes.OK)
    .json({ message: 'Please check your email for reset password link' });
}

const resetPassword = async(req, res) => {
    const {token, email, oldPassword, newPassword, confirmNewPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmNewPassword) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    // check first the password token if it still valid
    const user = await User.findOne({email});

    if(!(user.passwordVerificationToken === createHash(token) && 
        user.passwordVerificationTokenExpiration > Date.now())) {
            throw new CustomError.UnauthorizedError('AUthorization failed');
    }
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isOldPasswordCorrect) {
        throw new CustomError.UnauthorizedError('Wrong credentials! old password is incorrect');
    }
    if(newPassword !== confirmNewPassword) {
        throw new CustomError.UnauthorizedError('New password and Confirm password did not match');
    }
    // everthing went well, update the password in database
    user.password = newPassword;
    user.passwordVerificationToken = null;
    user.passwordVerificationTokenExpiration = null;
    await user.save();
    res
    .status(StatusCodes.OK)
    .json({ message: 'Success, Please go to login to check it' });
}

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
}