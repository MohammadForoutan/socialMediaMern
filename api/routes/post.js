const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
const { verify } = require('../middlewares/auth');

// create a post
router.post('/', verify, postController.createPost);
// update a post
router.put('/:id', verify, postController.updatePost);
// delete a post
router.delete('/:id', verify, postController.deletePost);
// like/dislike  a post
router.put('/:id/like', verify, postController.likePost);
// get timeLine post
router.get('/timeline',verify,  postController.getTimelinePosts);
// get a post
router.get('/post/:id', postController.getPost);
// get user's posts
router.get('/profile/:username', postController.getUserPosts);

module.exports = router;
