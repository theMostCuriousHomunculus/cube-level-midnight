const mongoose = require('mongoose')
const { Comment, commentSchema } = require('./comment-model')

const postSchema = new mongoose.Schema({
    post_title: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    tags: [String]
}, {
    timestamps: true
})

postSchema.index({ post_title: "text", tags: "text" })

const Post = mongoose.model('Post', postSchema)

module.exports = Post