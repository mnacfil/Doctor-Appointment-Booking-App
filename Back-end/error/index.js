const BadRequestError = require('./BadRequestError');
const UnauthorizedError = require('./UnauthorizedError');
const UnauthenticatedError = require('./UnauthenticatedError');
const NotFoundError = require('./NotFoundError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ForbiddenError,
    UnauthenticatedError
}