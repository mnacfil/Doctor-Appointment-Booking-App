const jwt = require('jsonwebtoken');

const createJWT = ({payload}) => jwt.sign(payload, process.env.JWT_SECRET);

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = async ({res, user, refreshToken}) => {
    const accessJWT = createJWT({payload: {user}});
    const refreshJWT = createJWT({payload: {user, refreshToken}});

    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;

    res.cookie('accessJWT', accessJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay)
    });
    res.cookie('refreshJWT', refreshJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneMonth)
    });
}

module.exports = {
    isTokenValid,
    attachCookiesToResponse
}