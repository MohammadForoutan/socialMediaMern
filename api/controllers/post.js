const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
	// create new Post
	const newPost = new Post({
		userId: req.user._id,
		description,
		image
	});

	try {
		// save post
		const savedPost = await newPost.save();
		// send post
		res.status(200).json('post created');
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.updatePost = async (req, res) => {
	const postId = req.params.id;
	try {
		// find post
		const post = await Post.findById(postId);

		const isAuthor = post.userId.toString() === req.user._id.toString();
		if (isAuthor) {
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
		const postId = req.params.id;
		// find post
		const post = await Post.findById(postId);

		const isAuthor = post.userId.toString() === req.user._id.toString();
		if (isAuthor) {
			await post.deleteOne();
			res.status(201).json('post has been deleted');
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
		const postId = req.params.id;
		const post = await Post.findById(postId);
		await post.toggleLikePost(req.user._id);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getPost = async (req, res) => {
	const postId = req.params.id;
	try {
		// find and send post
		const post = await Post.findById(postId);
		res.status(200).json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getTimelinePosts = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		const timelinePosts = await Post.getTimeLine(user);
		// send response
		res.status(200).json(timelinePosts);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getUserPosts = async (req, res) => {
	try {
		// get data
		const { username } = req.params;
		const user = await User.findOne({ username });
		// find user
		const posts = await Post.findUserPosts(user._id)
		// send response
		res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
