const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const authentication = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.redirect('/welcome')
    }
}

module.exports = authentication