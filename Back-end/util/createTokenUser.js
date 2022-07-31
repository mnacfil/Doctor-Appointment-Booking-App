

const createTokenUser = (user) => {
    return {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userId: user._id
    }
}

module.exports = createTokenUser