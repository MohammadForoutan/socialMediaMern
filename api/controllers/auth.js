const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { expressErrHandler } = require('../util/error');

exports.register = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { username, email, password, _id } = req.body;
		const newUser = {
			_id: _id,
			username,
			email,
			password,
		};

		// create user
		const user = new User(newUser);
		const token = await user.generateAuthToken();
		await user.save();

		// eslint-disable-next-line
		const { password: hashedPassword, ...others } = user._doc;
		res.status(201).json({ user: others, token });
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'user not found' });
		}

		// validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'wrong password' });
		}

		// generate token
		const token = await user.generateAuthToken();

		res.status(200).json({ user, token });
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.logout = async (req, res, next) => {
	const user = req.user;
	const token = req.token;
	// both user and token required
	if (!user && !token) {
		return res
			.status(400)
			.json({ message: 'user and token should be provided' });
	}
	try {
		await user.logout(token);
		res.status(200).json({ message: 'user logout successfully' });
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.logoutAll = async (req, res, next) => {
	const user = req.user;
	const token = req.token;
	// both user and token required
	if (!user && !token) {
		return res
			.status(403)
			.json({ message: 'user and token should be provided' });
	}
	try {
		await user.logoutAll();

		res.status(200).json({
			message: 'all sessions logout successfully',
			tokens: user.tokens,
		});
	} catch (err) {
		expressErrHandler(err, next);
	}
};
