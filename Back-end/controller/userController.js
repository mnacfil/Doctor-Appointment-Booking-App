const User = require('../model/User')

const getAllUser = async(req, res) => {
    res.send('get all user')
}

const getSingleUser = async(req, res) => {
    res.send('getSingleUser')
}

const myProfile = async(req, res) => {
    res.send('myProfile')
}

const updateUser = async(req, res) => {
    res.send('updateUser')
}

const deleteUser = async(req, res) => {
    res.send('deleteUser')
}

module.exports = {
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
    myProfile
}