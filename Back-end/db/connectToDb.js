const mongoose = require('mongoose');

const connectToDb = (uri) => {
    return mongoose.connect(uri);
}

module.exports = connectToDb;