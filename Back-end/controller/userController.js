const User = require('../model/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../error');
const {accessPermission} = require('../util');


const getAllUser = async(req, res) => {
    const users = await User.find({role: 'user'});
    res.status(StatusCodes.OK).json({users, list: users.length});
}

const getSingleUser = async(req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if(!user) {
        throw new CustomError.NotFoundError('No user found')
    }
    accessPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
}

const myProfile = async(req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
}

const updateUser = async(req, res) => {
    const user = await User.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).select('-password');
    if(!user) {
        throw new CustomError.NotFoundError('No user found');
    }
    accessPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
}

const deleteUser = async(req, res) => {
    const user = await User.findOne({_id: req.params.id});;
    if(!user) {
        throw new CustomError.NotFoundError('No user found');
    }
    accessPermission(req.user, user._id);
    await user.remove();
    res.status(StatusCodes.OK).json({message: "Delete user succesfully"});
}

module.exports = {
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
    myProfile
}