const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
	try {
		const newPost = new Post(req.body);

		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('post has been updated');
		} else {
			res.status(403).json('you can update only your post');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		console.log(post.userId.toString() === req.body.userId.toString())
		if (post.userId.toString() === req.body.userId.toString()) {
			await post.deleteOne();
			res.status(200).json('post has been deleted');
		} else {
			res.status(403).json('you can delete only your post');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const hasLike = post.likes.includes(req.body.userId);

		if (!hasLike) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('post has been liked');
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('post has been disliked');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getTimelinePosts = async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.userId);

		const timelinePosts = await Post.find(
			{ userId: [...currentUser.followings, req.params.userId] },
			null,
			{ sort: { createdAt: -1 } }
		).populate({
			model: 'User',
			path: 'userId',
			select: 'avatar username'
		});

		res.status(200).json(timelinePosts);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		const posts = await Post.find({ userId: user._id }, null, {
			sort: { createdAt: -1 }
		}).populate({
			path: 'userId',
			model: 'User',
			select: 'avatar username'
		});

		res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
