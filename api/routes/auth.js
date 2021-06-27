const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { verify } = require('../middlewares/auth');
const { body } = require('express-validator');
const User = require('../models/User');

// Register
router.post(
	'/register',
	[
		body('username')
			.trim()
			.isLength({ min: 2 })
			.custom(async (value) => {
				const user = await User.findOne({ username: value });
				if (user) {
					return Promise.reject(
						'a account with this username already exist'
					);
				}
				return Promise.resolve();
			}),
		body('email')
			.trim()
			.isEmail()
			.normalizeEmail()
			.toLowerCase()
			.custom(async (value) => {
				const user = await User.findOne({ email: value });
				if (user) {
					return Promise.reject(
						'a account with this username already exist'
					);
				}
				return Promise.resolve();
			}),
		body('password').trim().isLength({ min: 6 }),
		body('confirmPassword').custom((value, { req }) => {
			const isEqual = value === req.body.password;
			if (!isEqual) {
				return Promise.reject(
					'Password confirmation does not match password'
				);
			}
			return Promise.resolve();
		}),
	],
	authController.register
);
// login
router.post(
	'/login',
	[
		body('email').trim().isEmail().normalizeEmail().toLowerCase(),
		body('password').trim().isLength({ min: 6 }),
	],
	authController.login
);
// logout
router.post('/logout', verify, authController.logout);

router.post('/logoutAll', verify, authController.logoutAll);

module.exports = router;
