const mongoose = require('mongoose')
const drafter_model = require('./drafter-model')

const lobbySchema = new mongoose.Schema({
    lobby_name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 30
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    drafters: [drafter_model.drafterSchema]
})

const Lobby = mongoose.model('Lobby', lobbySchema)

module.exports = {
    Lobby,
    lobbySchema
}