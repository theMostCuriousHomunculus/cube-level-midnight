const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const { Cube } = require('../models/cube-model')

const creatorAccess = async (req, res, next) => {

    try {
        var cube

        if (req.query.cube_id) {
            cube = await Cube.findById(req.query.cube_id)
        } else if (req.body.cube_id) {
            cube = await Cube.findById(req.body.cube_id)
        } else if (req.params.cube_id) {
            cube = await Cube.findById(req.params.cube_id)
        } else {
            // no cube id provided
            throw new Error()
        }

        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user || !user._id.equals(cube.cube_creator)) {
            creator_access = false
        } else {
            creator_access = true
        }

        req.user = user
        req.cube = cube
        next()
    } catch (e) {
        res.status(404).send(e)
    }
}

module.exports = creatorAccess