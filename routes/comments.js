const express = require('express')

const Comments = require('../schemas/comments')
const Posts = require('../schemas/posts')

const router = express.Router()

//get all comments (not necessary but created anyway)
router.get('/comments', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, comment: 1 }).sort({ createdAt: -1 })
    const postId = comments.map(comment => comment.postId)
    const posts = await Posts.find({ postId: postId })
    const result = posts.map(post => {
        return {
            postId: post.postId,
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    })
    res.json({
        data: result
    })
})

//get detail comments
router.get('/comments/:postId', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, comment: 1 }).sort({ createdAt: -1 })
    const {postId} = req.params
    const posts = await Posts.find({ postId: postId })
    const result = posts.map(post => {
        return {
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    })
    res.json({
        data: result
    })
})

//add a comments
router.post('/post/:postId/comments', async (req, res) => {
    const { postId } = req.params
    const { user, password, comment } = req.body

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    const createComment = await Comments.create({
        postId,
        user,
        password,
        comment
    })
    return res.json({
        comment: createComment
    })
})

//edit comments
router.put('/post/comments', async (req, res) => {
    const { _id, password, comment } = req.body
    const data = await Comments.findOne({ _id: _id })
    const passwordcomment = data.password
    const postId = data.postId

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    if (password !== passwordcomment) {
        return res.json({ errorMessage: "Auth failed" })
    }

    if (data) {
        await Comments.updateOne({ _id: _id },
            {
                $set: {
                    comment: comment
                }
            })
    }
    return res.json({
        postId,
        result: 'success',
        success: true,
    })
})

//delete comments
router.delete('/post/:postId/comments', async (req, res) => {
    const { _id, password } = req.body
    const data = await Comments.findOne({ _id: _id })
    const passwordcomment = data.password

    if (!data) {
        return res.status(400).json({
            errorMessage: "Data not found"
        })
    }

    if (password !== passwordcomment) {
        return res.json({ errorMessage: "Auth failed" })
    }

    if (data) {
        await Comments.deleteOne({ _id: _id })
    }
    return res.json({
        result: 'success',
        success: true,
    })
})

module.exports = router