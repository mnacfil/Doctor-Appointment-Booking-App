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
    return res.status(customError.statusCode).json({message: customError.message})
}

module.exports = errorHandlerMiddleware