const request = require('supertest');
const app = require('../app');
const { update } = require('../models/Post');
const Post = require('../models/Post');
const User = require('../models/User.js');
const { setupDatabase, userOne, userOneId, userTwo } = require('./fixtures/db');

let post;
beforeEach(async () => {
	await setupDatabase();
	await Post.deleteMany();
	post = await Post({ description: 'Hello', userId: userOne._id }).save();
});

// create post
test('should create a psot', async () => {
	const response = await request(app)
		.post('/api/posts/')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'this is a test'
		})
		.expect(201);

	expect(response.body.description).toEqual('this is a test');
});

test('should not create a post (empty file)', async () => {
	const response = await request(app)
		.post('/api/posts/')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: ''
		})
		.expect(400);
});

// update post
test('should not update a post (empty file)', async () => {
	const response = await request(app)
		.put(`/api/posts/${post._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: ''
		})
		.expect(400);
});

test('should not update others post ', async () => {
	const response = await request(app)
		.put(`/api/posts/${post._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send({
			description: 'asd'
		})
		.expect(403);
});

test('should update a post successfully', async () => {
	const response = await request(app)
		.put(`/api/posts/${post._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'asdasd'
		})
		.expect(200);

	const updatedPost = await Post.findById(post._id);
	expect(updatedPost.description).toEqual('asdasd');
});

// delete post
test('should delete a post successfully', async () => {
	const response = await request(app)
		.delete(`/api/posts/${post._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const updatedPost = await Post.findById(post._id);
	expect(updatedPost).toEqual(null);
});

test('should not delete invalid user', async () => {
	await request(app)
		.delete(`/api/posts/${post._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(403);
});

// like post
test('should like post and then unlike successfully', async () => {
	// like post
	await request(app)
		.put(`/api/posts/${post._id}/like`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

	const likedPost = await Post.findOne({ description: post.description });
	expect(likedPost.likes[0].toString()).toEqual(userOne._id.toString());
	expect(likedPost.likes.length).toEqual(1);

	// dislike post
	await request(app)
		.put(`/api/posts/${post._id}/like`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

	const dislikedPost = await Post.findOne({ description: post.description });
	expect(dislikedPost.likes.length).toEqual(0);
});

// get posts

// -- timeline
test('should get timeline posts', async () => {
	await request(app)
		.get('/api/posts/timeline')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);
});

test('should not get timeline posts cause invalid Authorization', async () => {
	await request(app)
		.get('/api/posts/timeline')
		.set('Authorization', `Bearer asdasdasdasdasdasd`)
		.expect(403);
});

// -- single psot

test('should get a single post data', async () => {
	const response = await request(app)
		.get(`/api/posts/post/${post._id}`)
		.expect(200);

	expect(response.body.description).toEqual('Hello');
});

// -- a user post (profile post)

test('should get a user posts', async () => {
	const response = await request(app)
		.get(`/api/posts/profile/${userOne.username}`)
		.expect(200);

	const posts = response.body;
	expect(posts[0].description).toEqual(post.description);
});
