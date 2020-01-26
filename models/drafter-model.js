const mongoose = require('mongoose')
const cube_model = require('./cube-model')

const drafterSchema = new mongoose.Schema({
    drafter_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    queue: [[cube_model.cardSchema]],
    packs: [[cube_model.cardSchema]],
    picks: [cube_model.cardSchema]
})

const Drafter = mongoose.model('Drafter', drafterSchema)

module.exports = {
    Drafter,
    drafterSchema
}