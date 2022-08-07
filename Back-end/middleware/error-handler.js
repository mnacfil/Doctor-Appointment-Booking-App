const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal Server Error, Please try again later!'
    }
    if(err.name === 'ValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST
        customError.message = Object.values(err.errors).map(property => {
            const {message} = property
            return message
        }).join(', ')
    }
    if(err.name === 'CastError') {
        customError.statusCode = StatusCodes.NOT_FOUND
        customError.message = `Resource not found, No user found with id : ${err.value}`
    }
    // if(err.code = 11000) {
    //     customError.StatusCodes = StatusCodes.BAD_REQUEST
    //     customError.message = `Duplicate error`
    // }
    return res.status(customError.statusCode).json({message: customError.message})
}

module.exports = errorHandlerMiddleware