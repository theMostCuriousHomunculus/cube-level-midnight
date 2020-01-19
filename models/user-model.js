const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    account_name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the string "password".')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    sent_bud_requests: [{
        potential_buds: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    received_bud_requests: [{
        aspiring_buds: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    buds: [{
        buds: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    blocked_users: [{
        dicks: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('cube-model', { 
    ref: 'Cube',
    localField: '_id',
    foreignField: 'cube_creator'
})

userSchema.virtual('comment-model', { 
    ref: 'Comment',
    localField: '_id',
    foreignField: 'author'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, '!Boobies%22')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login.')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login.')
    }

    return user
}

userSchema.index({ account_name: "text" })

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User