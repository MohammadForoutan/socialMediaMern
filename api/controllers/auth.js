const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
	try {
		// get data from body
		const { username, email, password } = req.body;

		// generate hash password
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create user
		const user = new User({
			username,
			email,
			password: hashedPassword
		});

		// save user and response
		await user.save();
		res.status(200).json({ user });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.loginUser = async (req, res) => {
	try {
		// get data
		const { email, password } = req.body;
		// find user
		const user = await User.findOne({ email });

		// if no found
		if (!user) {
			return res.status(404).json('user not found');
		}

		// validate password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json('wrong password');
		}

		// JWT payload
		const payload = {
			_id: user._id,
			username: user.username,
			email: user.email
		};
		// json-web-token 
		// jwt accessToken
		const accessToken = await jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: process.env.ACCESS_TOKEN_LIFE }
		);
		// jwt refreshToken 
		const refreshToken = await jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: process.env.ACCESS_TOKEN_LIFE }
		);

		// set refreshToken in user document
		user.refreshToken = refreshToken;

		// save user and set cookie
		await user.save();
		res.cookie('jwt', accessToken, { httpOnly: true });
		// successfully login and response
		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.refreshToken = async (req, res) => {
	// Take accessToken from cookie
	const acecessToken = req.cookie.jwt;

	if (!acecessToken) {
		return res.status(403).send();
	}

	let payload;
	try {
		// verify accessToken
		payload = await jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET
		);
	} catch (err) {
		return res.status(401).send();
	}

	// find user
	const user = await User.findById(payload._id);

	try {
		// verify refreshToken
		await jwt.verify(user.refreshToken, process.env.ACCESS_TOKEN_SECRET);
	} catch (err) {
		return res.status(401).send();
	}
	// sign a new accessToken
	const newAccessToken = await jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_LIFE }
	);

	// set accessToken in cookie
	res.cookie('jwt', newAccessToken, { secure: true, httpOnly: true });
	res.send();
};
