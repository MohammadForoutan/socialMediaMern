const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
	// create new Post
	const newPost = new Post(req.body);
	try {
		// save post
		const savedPost = await newPost.save();
		// send post
		res.status(200).json(savedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.updatePost = async (req, res) => {
	try {
		// find post
		const post = await Post.findById(req.params.id);
		// if post is his/hers
		if (post.userId === req.payload._id) {
			// update and send post
			await post.updateOne({ $set: req.body });
			res.status(200).json('post has been updated');
		} 
		// if post is NOT his/hers
		else {
			res.status(403).json('you can update only your post');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.deletePost = async (req, res) => {
	try {
		// find post
		const post = await Post.findById(req.params.id);

		
		// if post is hers/his
		if (post.userId.toString() === req.payload._id.toString()) {
			// delete post and send success reponse
			await post.deleteOne();
			res.status(201).json('post has been deleted');
		
		} 
		// if post is NOT hers/his
		else {
			res.status(403).json('you can delete only your post');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.likePost = async (req, res) => {
	try {
		// find post
		const post = await Post.findById(req.params.id);
		// user has like post or NOT
		const hasLike = post.likes.includes(req.payload._id);

		// if hasn't like
		if (!hasLike) {
			// update - add like
			await post.updateOne({ $push: { likes: req.body.userId } });
			// send response
			res.status(200).json('post has been liked');
		} 
		// if already like
		else {
			// update - remove like
			await post.updateOne({ $pull: { likes: req.body.userId } });
			// send response
			res.status(200).json('post has been disliked');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getPost = async (req, res) => {
	try {
		// find and send post
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getTimelinePosts = async (req, res) => {
	try {
		// find currentUser
		const currentUser = await User.findById(req.payload._id);

		// find user and his/her followings posts
		const timelinePosts = await Post.find(
			{ userId: [...currentUser.followings, req.payload._id] },
			null,
			{ sort: { createdAt: -1 } } 
		).populate({
			model: 'User',
			path: 'userId',
			select: 'avatar username'
		});

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

		// find user
		const user = await User.findOne({ username });
		// find user's posts
		const posts = await Post.find({ userId: user._id }, null, {
			sort: { createdAt: -1 }
		}).populate({
			path: 'userId',
			model: 'User',
			select: 'avatar username'
		});

		// send response
		res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
