const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
const { verify } = require('../middlewares/auth');

// create a post
router.post('/', postController.createPost)
// update a post
router.put('/:id', postController.updatePost)
// delete a post
router.delete('/:id', verify, postController.deletePost)
// like/dislike  a post
router.put('/:id/like', verify ,postController.likePost)
// get a post
router.get('/:id', postController.getPost)
// get timeLine post
router.get('/timeline', postController.getTimelinePosts)
// get user's posts
router.get('/profile/:username', postController.getUserPosts)



module.exports = router;
