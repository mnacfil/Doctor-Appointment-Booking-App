const CustomError = require('../error')

// to strict only user who login, can only view their own profile and not other profile
// Only admin can view each of user profile
const accessPermission = (requestUser, resourceId) => {
    if(requestUser.userId === resourceId.toString()) return // the user view his/her profile
    if(requestUser.role === 'admin') return // means admin can view whatever profile
    throw new CustomError.UnauthorizedError('You are not authorized to view this resource')
}

module.exports = accessPermission