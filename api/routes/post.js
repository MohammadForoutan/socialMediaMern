const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const postController = require('../controllers/post');
const { verify } = require('../middlewares/auth');

// create a post
router.post(
	'/',
	verify,
	[
		body('description').trim(),
		body('image').custom((value, { req }) => {
			if (!value && !req.body.description.trim()) {
				return Promise.reject(
					'you should enter image or amy text at least'
				);
			}

			return Promise.resolve();
		})
	],
	postController.createPost
);
// update a post
router.put(
	'/:id',
	verify,
	[
		body('description').trim(),
		body('image').custom((value, { req }) => {
			if (!value && !req.body.description.trim()) {
				return Promise.reject('you should enter image or amy text at least');
			}
			return Promise.resolve();
		})
	],
	postController.updatePost
);
// delete a post
router.delete('/:id', verify, postController.deletePost);
// like/dislike  a post
router.put('/:id/like', verify, postController.likePost);
// get timeLine post
router.get('/timeline', verify, postController.getTimelinePosts);
// get a post
router.get('/post/:id', postController.getPost);
// get user's posts
router.get('/profile/:username', postController.getUserPosts);

module.exports = router;
