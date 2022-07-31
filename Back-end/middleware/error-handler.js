const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal Server Error, Please try again later!'
    }
    return res.status(customError.statusCode).json({message: err.message})
}

module.exports = errorHandlerMiddleware