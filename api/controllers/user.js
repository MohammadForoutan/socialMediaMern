const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const validFields = require('../util/validUserFields');
const { expressErrHandler } = require('../util/error');

exports.updateUser = async (req, res, next) => {
	// get error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		// is user owner of account
		const isOwner = user.isOwner(req.user._id, userId);

		if (!isOwner) {
			return res.status(403).json('you can only update your account');
		}

		// if invalid field insert
		const updates = Object.keys(req.body);
		const isValidOperation = updates.every((update) =>
			validFields.includes(update)
		);
		if (!isValidOperation) {
			return res.status(400).json('Invalid updates !!!');
		}
		// update password if password updated
		const isPasswordUpdated =
			req.body.password && req.body.password.trim().length >= 6;
		if (isPasswordUpdated) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);
			await user.updateOne({ ...req.body, password: hashedPassword });
		}

		// update user (password will updaed if password Entered )
		await user.updateOne({
			...req.body,
			password: user.password,
		});

		// send response
		res.status(200).json('account has been updated');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.deleteUser = async (req, res, next) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(req.user._id, userId);
		const isOwner = user.isOwner(req.user._id, userId);

		if (!isOwner) {
			return res.status(403).json('you can only delete your account');
		}

		// delete User

		await user.deleteOne();
		return res.status(200).json('account has been deleted successfully');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getUser = async (req, res, next) => {
	const { userId, username } = req.query;
	try {
		let user;
		// find user with userId or username
		const isQueryWithUserId = Boolean(userId);
		if (isQueryWithUserId) {
			user = await User.findById(userId);
		} else {
			user = await User.findOne({ username });
		}

		if (!user) {
			return res.status(404).json('user not found');
		}

		// send data (without password)
		// eslint-disable-next-line
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.searchUsers = async (req, res, next) => {
	const { username } = req.query;
	try {
		const users = await User.find(
			{ username: { $regex: username, $options: 'i' } },
			'username email avatar'
		);
		res.status(200).json(users);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.followUser = async (req, res, next) => {
	try {
		const isYourSelf = req.user._id.toString() === req.params.id.toString();

		// user can follow yourself
		if (isYourSelf) {
			return res.status(400).json("you can't follow yourself");
		}

		const contactUser = await User.findById(req.params.id);
		const currentUser = await User.findById(req.user._id);

		const hasUserFollowed = contactUser.followers.includes(req.user._id);
		// can't follow your following again
		if (hasUserFollowed) {
			return res.status(403).json('you already follow this user');
		}

		// update contact user followers
		await contactUser.updateOne({ $push: { followers: req.user._id } });
		// update current user followings
		await currentUser.updateOne({ $push: { followings: req.params.id } });

		res.status(200).json(`you follow ${contactUser.username} successfully`);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.unFollowUser = async (req, res, next) => {
	try {
		const isYourself = req.user._id.toString() === req.params.id;
		if (isYourself) {
			return res.status(403).json("you can't unfollow yourself");
		}
		const user = await User.findById(req.params.id);
		const currentUser = await User.findById(req.user._id);

		const hasUserFollowed = user.followers.includes(req.user._id);
		if (!hasUserFollowed) {
			return res.status(403).json("you didn't follow this user");
		}

		// delete user in contact user followes and current user followings
		await user.updateOne({ $pull: { followers: req.user._id } });
		await currentUser.updateOne({
			$pull: { followings: req.params.id },
		});
		return res.status(200).json('user has been unfollowed');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getUserFollowings = async (req, res, next) => {
	const userId = req.params.id;
	try {
		// find user
		const user = await User.findById(userId).populate({
			model: 'User',
			path: 'followings',
			select: 'username avatar',
		});

		const followings = user.followings;
		res.status(200).json(followings);
	} catch (err) {
		expressErrHandler(err, next);
	}
};
