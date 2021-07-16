const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verify = async (req, res, next) => {
	let token = req.header('Authorization');
	if (!token) {
		return res.status(401).json({ error: 'token is not exist' });
	}

	token = token.replace('Bearer ', '');
	try {
		const payload = await jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET
		);
		const user = await User.findById(payload._id);

		req.token = token;
		req.user = user;
		next();
	} catch (err) {
		res.status(401).json('Forbidden!!!');
		console.log(err);
	}
};
