const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { verify } = require('../middlewares/auth');
const { body } = require('express-validator');

// Register
router.post(
	'/register',
	[
		body('email').trim().isEmail().normalizeEmail().toLowerCase(),
		body('password').trim().isLength({ min: 6 }),
		body('username').trim().isLength({ min: 2 }),
		body('passwordConfirm')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					return Promise.reject(
						'password and its confirmation are not same'
					);
				}
			})
	],
	authController.register
);
// login
router.post(
	'/login',
	[
		body('email').trim().isEmail().normalizeEmail().toLowerCase(),
		body('password').trim().isLength({ min: 6 })
	],
	authController.login
);
// logout
router.post('/logout', verify, authController.logout);

router.post('/logoutAll', verify, authController.logoutAll);

module.exports = router;
