const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user');
const { verify } = require('../middlewares/auth');
const validator = require('validator');
const User = require('../models/User');

// Update user
router.put(
	'/:id',
	verify,
	[
		body('email')
			.toLowerCase()
			.custom(async (value, { req }) => {
				let email = value;

				if (req.user.email === email) {
					return Promise.resolve();
				}

				//  if email check
				const isEmail = validator.isEmail(email);
				if (!isEmail) {
					return Promise.reject('Please enter a valid email');
				} else {
					// if email is already taken
					const isEmailExist = await User.findOne({ email });
					if (isEmailExist) {
						return Promise.reject('email is already taken');
					}

					// success
					return Promise.resolve();
				}
			}),
		body('password').custom((value) => {
			if ((value && value.length >= 6) || !value) {
				return Promise.resolve();
			}

			if (value && value.length < 6) {
				return Promise.reject(
					"password length shouldn't be less than 6"
				);
			}
		}),
		body('username')
			.isLength({ min: 2 })
			.custom(async (value, { req }) => {
				let username = value;
				if (req.user.username === username) {
					return Promise.resolve();
				}

				// if already taken
				const isUsernameExist = await User.findOne({ username });
				if (isUsernameExist) {
					return Promise.reject('username is already taken');
				}

				// success
				return Promise.resolve();
			})
	],
	userController.updateUser
);
// Delete user
router.delete('/:id', verify, userController.deleteUser);
// Get a user
router.get('/', userController.getUser);
// search along users
router.get('/search', userController.searchUsers);
// Follow a user
router.put('/:id/follow', verify, userController.followUser);
// UnFollow a user
router.put('/:id/unfollow', verify, userController.unFollowUser);
// Get Followings
router.get('/followings/:id', userController.getUserFollowings);

module.exports = router;
