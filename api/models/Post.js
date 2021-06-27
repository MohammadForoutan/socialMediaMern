const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		description: {
			type: String,
			max: 500,
		},
		image: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

PostSchema.methods.isAuthor = function (userId) {
	const post = this;
	return post.userId.toString() === userId.toString();
};

PostSchema.methods.toggleLikePost = async function (userId) {
	const post = this;
	const hasLike = post.likes.includes(userId);

	try {
		if (!hasLike) {
			// update - add like
			await post.updateOne({ $push: { likes: userId } });
			return 'post has been liked';
		}
		// if already like
		else {
			// update - remove like
			await post.updateOne({ $pull: { likes: userId } });
			return 'post has been disliked';
		}
	} catch (err) {
		console.log(err);
	}
};

PostSchema.statics.getTimeLine = async function (user) {
	// find user and his/her followings posts
	const timelinePosts = await this.find(
		{ userId: [...user.followings, user._id] },
		null,
		{ sort: { createdAt: -1 } }
	).populate({
		model: 'User',
		path: 'userId',
		select: 'avatar username',
	});

	return timelinePosts;
};

PostSchema.statics.findUserPosts = async function (userId) {
	// find user's posts
	const posts = await this.find({ userId }, null, {
		sort: { createdAt: -1 },
	}).populate({
		path: 'userId',
		model: 'User',
		select: 'avatar username',
	});

	return posts;
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
