const express = require('express')
const Post = require('../models/post-model')
const User = require('../models/user-model')
const authentication = require('../middleware/authentication')
const router = new express.Router()

// this currently just drops a static post into the database
router.post('/blog/post', async (req, res) => {

    try {
        const post = new Post({
            post_title: "Multicolor Card Considerations",
            body: "<p>It can be tempting to want to run lots of multicolor cards in a cube, as they often produce powerful effects that combine the strengths of two or more different colors.  However, mana fixing in cubes is not as reliable as in constructed formats, which means it will be harder to reliably cast multicolor cards on curve.</p><p>Another aspect to consider is that aggressive strategies benefit least from the inclusion of multicolor cards.  Since aggressive decks aim to have a very low mana curve and cannot afford to spend their early turn mana in order to fix their mana, they are less likely to be able to play their multicolor cards on curve.</p>"
        })

        await post.save()
        res.status(201).redirect('/blog')
    } catch(error) {
        res.status(400).redirect('/blog')
    }
})

// display all blog posts
router.get('/blog', async (req, res) => {
    
    const posts = await Post.find({})

    res.render('blog', {
        posts: posts,
        title: "Blog"
    })
})

// display blog posts related to search
router.get('/blog/search', async (req, res) => {
    
    const posts = await Post.find({ $text: { $search: req.query.topic_search } },
        { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })

    res.render('blog', {
        posts: posts,
        title: "Blog"
    })
})

router.get('/blog/article', async (req, res) => {

    const post = await Post.findById(req.query.article_id)
    var { comments } = post

    // this will display the user's account name, rather than their database ID, to the client
    const findUsers = new Promise(async (resolve, reject) => {
        try {
            comments.forEach(async function (comment) {
                var user = await User.findById(comment.author)
                comment.account_name = user.account_name
            })
            resolve(comments)
        } catch {
            reject("Unable to render comments for this post.")
        }
    })

    findUsers.then((result) => {
        res.render('article', {
            title: post.post_title,
            createdAt: post.createdAt,
            body: post.body,
            post_id: post._id,
            comments: result
        })
    }).catch((error) => {
        res.render('article', {
            title: post.post_title,
            createdAt: post.createdAt,
            body: post.body,
            post_id: post._id
        })
        console.log(error)
    })
})

router.post('/blog/comment', authentication, async (req, res) => {

    const post = await Post.findById(req.body.post_id)
    const comment = {
        author: req.user._id,
        body: req.body.comment_body
    }

    const postComment = new Promise(async (resolve, reject) => {
        try {
            post.comments.push(comment)
            await post.save()
            resolve(post)
        } catch(error) {
            reject("Unable to post comment.  Try again later.")
        }
    })
    
    postComment.then((result) => {
        res.status(201).redirect('/blog/article?article_id=' + result._id)
    }).catch((error) => {
        res.status(400).redirect('/blog/article?article_id=' + post._id)
        console.log(error)
    })
})

module.exports = router