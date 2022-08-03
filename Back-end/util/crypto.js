const crypto = require('crypto')

const createHash = (string) => crypto.createHash('md5').update(string).digest('hex')
const createCryptoToken = (amount) => crypto.randomBytes(amount).toString('hex')

module.exports = {
    createCryptoToken,
    createHash
}