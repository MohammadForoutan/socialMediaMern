const User = require('../models/User');
const bcrypt = require('bcrypt');
const { populate } = require('../models/User');

exports.updateUser = async (req, res) => {
	try {
		let hashedPassword;
		if (req.body.userId === req.params.id || req.body.isAdmin) {
			if (req.body.password) {
				if (req.body.password.trim().length >= 6) {
					const salt = await bcrypt.genSalt(12);
					hashedPassword = await bcrypt.hash(req.body.password, salt);
				}
			}
		} else {
			return res.status(403).json('you can only update your account');
		}
		const user = await User.findById(req.params.id);
		await user.updateOne({...req.body, password: hashedPassword || user.password})
		res.status(200).json('account has been updated');
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		if (req.body.userId === req.params.id || req.body.isAdmin) {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json('account has been updated successfully');
		} else {
			return res.status(403).json('you can only delete your account');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getUser = async (req, res) => {
	try {
		const { userId, username } = req.query;

		const isQueryWithUserId = Boolean(userId);

		let user;
		if (isQueryWithUserId) {
			user = await User.findById(userId);
		} else {
			user = await User.findOne({ username: username });
		}
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.followUser = async (req, res) => {
	try {
		if (req.body.userId !== req.params.id) {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);

			const hasUserFollowed = user.followers.includes(req.body.userId);
			if (!hasUserFollowed) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({
					$push: { followings: req.params.id }
				});
				return res.status(200).json('user has been followed');
			} else {
				return res.status(403).json('you already follow this user');
			}
		} else {
			res.status(403).json("you can't follow yourself");
		}
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

exports.unFollowUser = async (req, res) => {
	try {
		if (req.body.userId !== req.params.id) {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);

			const hasUserFollowed = user.followers.includes(req.body.userId);
			if (hasUserFollowed) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
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
	try {
		const { id } = req.params;

		const user = await User.findById(id, '_id').populate({
			model: 'User',
			path: 'followings',
			select: 'username avatar'
		});
		const followings = user.followings;
		res.status(200).json(followings);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
