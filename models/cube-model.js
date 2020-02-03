const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    oracle_id: {
        type: String,
        required: true
    },
    type_line: {
        type: String,
        required: true
    },
    mana_cost: {
        type: String,
        required: true
    },
    cmc: {
        type: Number,
        required: true
    },
    color_identity: {
        type: Array,
        required: true
    },
    power: {
        type: Number,
        required: false
    },
    toughness: {
        type: Number,
        required: false
    },
    loyalty: {
        type: Number,
        required: false
    },
    set: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    back_image: {
        type: String,
        required: false
    },
    purchase_link: {
        type: String,
        required: false
    }
})

const Card = mongoose.model('Card', cardSchema)

const moduleSchema = new mongoose.Schema({
    module_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 30
    },
    cards: [cardSchema]
})

const Module = mongoose.model('Module', moduleSchema)

const rotationSchema = new mongoose.Schema({
    rotation_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 30
    },
    size: {
        type: Number,
        required: true
    },
    cards: [cardSchema]
})

const Rotation = mongoose.model('Rotation', rotationSchema)

const cubeSchema = new mongoose.Schema({
    cube_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 30
    },
    main_board: [cardSchema],
    sideboard: [cardSchema],
    modules: [moduleSchema],
    rotations: [rotationSchema],
    cube_creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cube_description: {
        type: String,
        default: undefined,
        maxlength: 300
    }
})

// Return all cubes the user has created
cubeSchema.statics.findByCreator = async (cube_creator) => {
    const cubes = await Cube.find({ cube_creator })
    return cubes
}

const Cube = mongoose.model('Cube', cubeSchema)

module.exports = {
    Cube,
    cardSchema
}
