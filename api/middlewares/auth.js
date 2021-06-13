const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verify = async (req, res, next) => {
	const token = req.header('Authorization').replace("Bearer ", "");
	if(!token) {
		return res.status(403).json({error: 'token is not exist'})
	}

	try {
		const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		const user = await User.findById(payload._id)

		req.token = token
		req.user = user;
		next()
	} catch (err) {
		res.status(403).json("Forbidden!!!")
		console.log(err)
	}
}
