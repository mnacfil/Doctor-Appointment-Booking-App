const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        trim: true,
        minLength: [3, 'Must be atleast 3 character, got{VALUE}'],
        maxLength: 30
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        maxLength: 100
    },
    contactNumber: {
        type: String,
        required: [true, 'Please provide contact number'],
        validate: {
            validator: validator.isMobilePhone,
            message: 'Please provide valid number'
        },
        maxLength: 11,
        minLength: 11
        },
    address: {
        type: String,
        required: [true, 'Please provide address']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        trim: true,
        minLength: 8,
        maxLength: 100
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'doctor'],
        default: 'user'
    },
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: "Appointment"
    },
    verificationToken: String,
    isVerified: {type: Boolean, default: false},
    verified: Date,
    passwordVerificationToken: String,
    passwordVerificationTokenExpiration: Date
})

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.post('remove', async function() {
    await this.model('Token').deleteMany({user: this._id})
})

UserSchema.methods.isPasswordCorrect = async function(userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)