const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
	try {
		// get error
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// get data from body
		const { username, email, password, _id } = req.body;
		const newUser = {
			_id: _id,
			username,
			email,
			password
		};

		// create user
		const user = new User(newUser);

		const token = await user.generateAuthToken();

		// save user and response
		await user.save();
		
		// eslint-disable-next-line
		const { password: hashedPassword, ...others } = user._doc;
		res.status(201).json({ user: others, token });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.login = async (req, res) => {
	try {
		// get error
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// get data
		const { email, password } = req.body;
		// find user
		const user = await User.findOne({ email });

		// if no found
		if (!user) {
			return res.status(404).json('user not found');
		}

		// validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json('wrong password');
		}

		// generate token
		const token = await user.generateAuthToken();

		// successfully login and response
		res.status(200).json({ user, token });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.logout = async (req, res) => {
	try {
		const user = req.user;
		const token = req.token;

		if (!user && !token) {
			return res.status(400).json({ message: 'user and token should be provided' });
		}

		await user.logout(token);

		res.status(200).json({ message: 'user logout successfully' });
	} catch (err) {
		console.log(err);
	}
};

exports.logoutAll = async (req, res) => {
	try {
		const user = req.user;
		const token = req.token;

		if (!user && !token) {
			return res.status(403).json({ message: 'user and token should be provided' });
		}

		await user.logoutAll();

		res.status(200).json({ message: 'all sessions logout successfully', tokens: user.tokens });
	} catch (err) {
		console.log(err);
	}
};
