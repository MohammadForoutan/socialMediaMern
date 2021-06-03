const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verify = async (req, res, next) => {
	let accessToken = req.cookies.jwt;
	if (!accessToken) {
		return res.status(403).json('no accessToken cookie found');
	}

	try {
		// verify accessToken and set in request
		const payload = await jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		req.payload = payload;
		console.log(
			'#################### use access Token ####################'
		);
		next();
	} catch (err) {
		console.log(
			'#################### use refresh Token ####################'
		);
		// if accessToken not valid or expired
		// check refreshToken
		const refreshToken = req.cookies.refresh;

		try {
      // verify refreshToken
			const payload = await jwt.verify(
				refreshToken,
				process.env.ACCESS_TOKEN_SECRET
			);

      // find user and create payload
			const user = await User.findById(payload._id);

			const userPayload = {
				_id: user._id,
				username: user.username,
				email: user.email
			};
      
			// json-web-token
			// rewrite jwt accessToken
			const accessToken = await jwt.sign(
				userPayload,
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: process.env.ACCESS_TOKEN_LIFE }
			);
			// rewrite jwt refreshToken
			const newRefreshToken = await jwt.sign(
				userPayload,
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: process.env.REFRESH_TOKEN_LIFE }
			);

			// verify accessToken and set in request
			const requestPayload = await jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET
			);

			req.payload = requestPayload;

      // save user
			user.refreshToken = newRefreshToken;
			await user.save();
			// set cookies again - overwrite cookie
			res.cookie('jwt', accessToken, { httpOnly: true });
			res.cookie('refresh', newRefreshToken, { httpOnly: true });

			next();
		} catch (err) {
			console.log(err);
			res.status(300).redirect('/login');
		}
	}
};
