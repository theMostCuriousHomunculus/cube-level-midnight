const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = {
    Comment,
    commentSchema
}