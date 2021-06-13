const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
	try {
		// get data from body
		const { username, email, password, _id } = req.body;
		const newUser = {
			username,
			email,
			password
		};

		if(_id) {
			newUser._id =  req.body._id
		}

		// create user
		const user = new User(newUser);

		const token = await user.generateAuthToken();

		// save user and response
		await user.save();
		const { password: hashedPassword, ...others } = user._doc;
		res.status(201).json({ user: others, token });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.login = async (req, res) => {
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
			return res.status(403).json({ message: 'ok' });
		}

		await user.logout(token);

		res.json({ message: 'user logout successfully' });
	} catch (err) {
		console.log(err);
	}
};

exports.logoutAll = async (req, res) => {
	try {
		const user = req.user;
		const token = req.token;

		if (!user && !token) {
			return res.status(403).json({ message: 'ok' });
		}

		await user.logoutAll();

		res.json({ message: 'all sessions logout successfully' });
	} catch (err) {
		console.log(err);
	}
};
