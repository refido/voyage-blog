const express = require('express');

const Comments = require('../schemas/comments');
const Posts = require('../schemas/posts')

const router = express.Router();

//get all posts
router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}, { postId: 1, title: 1, user: 1, createdAt: 1 }).sort({ createdAt: -1 })
    const result = posts.map(post => {
        return post
    })

    if (posts.length === 0) {
        return res.status(400).json({
            success: true,
            errorMessage: 'Failed to Fetch Data List or Data is empty'
        })
    }

    res.json({ data: result })
})

//get detail posts
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    const post = await Posts.find({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1 }).sort({ createdAt: -1 })

    if (post.length === 0) {
        return res.status(400).json({
            success: true,
            errorMessage: 'User Information Not Found'
        })
    }

    res.json({ data: post })
})

//add a posts
router.post('/posts', async (req, res) => {
    const { postId, user, title, password, content } = req.body
    const posts = await Posts.find({ postId })
    if (posts.length > 0) {
        return res.status(400).json({
            success: false,
            errorMessage: 'The post already exists'
        })
    }
    const createPost = await Posts.create({
        postId,
        user,
        title,
        password,
        content
    })
    return res.json({
        post: createPost
    })
})

//edit posts
router.put('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const { title, password, content } = req.body
    const post = await Posts.findOne({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1, password:1 })
    const passwordpost = post.password

    if (password !== passwordpost) {
        return res.json({
            errorMessage: "Auth failed"
        })
    }

    if (post) {
        await Posts.updateOne(
            {postId: +postId}, 
            {$set: {
                title: title, content:content
            }})
    }
    res.json({
        result: 'success',
        success: true,
    })
})


//delete posts
router.delete('/posts/:postId', async(req, res) => {
    const {postId} = req.params
    const {password} = req.body
    const post = await Posts.findOne({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1, password:1 })
    const passwordpost = post.password

    if (!post) {
        return res.status(400).json({
            errorMessage: "Data not found"
        })
    }

    if (password !== passwordpost) {
        return res.json({
            errorMessage: "Auth failed"
        })
    }

    if (post) {
        await Posts.deleteOne({postId: +postId})
        await Comments.deleteMany({postId: +postId})
    }
    res.json({
        result: 'success',
        success: true,
    })
})



module.exports = router