const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    account_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2 }
        }
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
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
        potential_bud: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    received_bud_requests: [{
        aspiring_bud: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    buds: [{
        bud: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    blocked_users: [{
        dick: {
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

userSchema.virtual('lobby-model', {
    ref: 'Lobby',
    localField: '_id',
    foreignField: 'host'
})

userSchema.virtual('drafter-model', {
    ref: 'Drafter',
    localField: '_id',
    foreignField: 'drafter_id'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

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