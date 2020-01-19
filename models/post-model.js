const mongoose = require('mongoose')
const comment_model = require('./comment-model')

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
    comments: [comment_model.commentSchema],
    tags: [String]
}, {
    timestamps: true
})

postSchema.index({ post_title: "text", tags: "text" })

const Post = mongoose.model('Post', postSchema)

module.exports = Post