const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.updateUser = async (req, res) => {
	try {
		let hashedPassword;

		// find user
		const user = await User.findById(req.params.id);

		// is user owner of account
		const isOwner = req.payload._id === req.params.id || user.isAdmin;
		// if password updated
		const isPasswordUpdated =
			req.body.password && req.body.password.trim().length >= 6;
		if (!isOwner) {
			return res.status(403).json('you can only update your account');
		}
		// update password if password updated
		if (isPasswordUpdated) {
			const salt = await bcrypt.genSalt(12);
			hashedPassword = await bcrypt.hash(req.body.password, salt);
		}
		// update user (password will updaed if password Entered )
		await user.updateOne({
			...req.body,
			password: hashedPassword || user.password
		});

		// send response
		res.status(200).json('account has been updated');
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		// find user
		const user = await User.findById(req.params._id);
		// is user owner of account
		const isOwner = req.payload._id === req.params.id || user.isAdmin;
		// delete User
		if (isOwner) {
			await user.deleteOne();
			return res
				.status(200)
				.json('account has been updated successfully');
		}
		// if not Owner
		else {
			return res.status(403).json('you can only delete your account');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getUser = async (req, res) => {
	try {
		// take data
		const { userId, username } = req.query;

		let user;
		// find user with userId or username
		const isQueryWithUserId = Boolean(userId);
		if (isQueryWithUserId) {
			user = await User.findById(userId);
		} else {
			user = await User.findOne({ username: username });
		}

		// send data (without password)
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.followUser = async (req, res) => {
	try {
		const isYourSelf = req.payload._id === req.params.id;

		// user can follow user (can't user her/himself)
		if (isYourSelf) {
			return res.status(403).json("you can't follow yourself");
		}

		const user = await User.findById(req.params.id);
		const currentUser = await User.findById(req.payload._id);

		// if target user followers include current user
		const hasUserFollowed = user.followers.includes(req.payload._id);
		// can't follow yourself
		if (hasUserFollowed) {
			// send 403 response
			return res.status(403).json('you already follow this user');
		}

		// update target user followers
		await user.updateOne({ $push: { followers: req.paload._id } });
		// update current user followings
		await currentUser.updateOne({
			$push: { followings: req.params.id }
		});

		// success response
		res.status(200).json(`you follow ${user.username} successfully`);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

exports.unFollowUser = async (req, res) => {
	try {
		
		if (req.payload._id.toString() !== req.params.id) {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.payload._id);

			const hasUserFollowed = user.followers.includes(req.payload._id);
			if (hasUserFollowed) {
				await user.updateOne({ $pull: { followers: req.payload._id } });
				await currentUser.updateOne({
					$pull: { followings: req.params.id }
				});
				return res.status(200).json('user has been unfollowed');
			} else {
				console.log("you didn't follow this user");
				return res.status(403).json("you didn't follow this user");
			}
		} else {
			console.log("you can't unfollow yourself");
			return res.status(403).json("you can't unfollow yourself");
		}
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getUserFollowings = async (req, res) => {
	// get data
	const { id } = req.params;

	try {
		// find user
		const user = await User.findById(id).populate({
			model: 'User',
			path: 'followings',
			select: 'username avatar'
		});

		const followings = user.followings;
		// send user's followings
		res.status(200).json(followings);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
