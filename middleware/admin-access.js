const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const adminAccess = async (req, res, next) => {

    const administrators = ['5e2d158fd9ab740017790702', '5e2b5ff40d95a11e5066e5a7']

    try {

        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user || !administrators.includes(user._id.toString())) {
            admin_access = false
        } else {
            admin_access = true
        }

        req.user = user
        next()
    } catch (e) {
        res.status(404).send(e)
    }
}

module.exports = adminAccess