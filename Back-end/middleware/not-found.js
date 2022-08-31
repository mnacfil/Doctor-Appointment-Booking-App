const notFoundMiddleware = (req, res) => res.status(404).json({msg: 'Resource not found', statusCode: 404});

module.exports = notFoundMiddleware;