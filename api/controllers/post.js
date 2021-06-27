const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { expressErrHandler } = require('../util/error');

exports.createPost = async (req, res, next) => {
	// get error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const newPost = new Post({
		userId: req.user._id,
		description: req.body.description,
		image: req.body.image,
	});

	try {
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.updatePost = async (req, res, next) => {
	// get error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const postId = req.params.id;
	try {
		// find post
		const post = await Post.findById(postId);
		const isAuthor = post.isAuthor(req.user._id);

		if (!isAuthor) {
			return res.status(403).json('you can only update your post');
		}

		await post.updateOne({ $set: req.body });
		res.status(200).json('post has been updated');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.id;
	try {
		const post = await Post.findById(postId);

		const isAuthor = post.isAuthor(req.user._id);
		if (!isAuthor) {
			return res.status(403).json('you can delete only your post');
		}

		await post.deleteOne();
		return res.status(200).json('post has been deleted');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.likePost = async (req, res, next) => {
	const postId = req.params.id;
	try {
		const post = await Post.findById(postId);
		const result = await post.toggleLikePost(req.user._id);
		res.status(200).json(result);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getPost = async (req, res, next) => {
	const postId = req.params.id;
	try {
		const post = await Post.findById(postId);
		res.status(200).json(post);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getTimelinePosts = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		const timelinePosts = await Post.getTimeLine(user);
		res.status(200).json(timelinePosts);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getUserPosts = async (req, res, next) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		const posts = await Post.findUserPosts(user._id);
		res.status(200).json(posts);
	} catch (err) {
		expressErrHandler(err, next);
	}
};
