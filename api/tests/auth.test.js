const request = require('supertest');
const app = require('../app');
const User = require('../models/User.js');
const {setupDatabase, userOne} = require('./fixtures/db')



beforeEach(async() => {
	await setupDatabase()
});

test('should register a new user', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'Test1',
			email: 'TEST1@test.com',
			password: '12345678'
		})
		.expect(201);

	// created user
	expect(response.body).toMatchObject({
		user: {
			avatar: '',
			cover: '',
			followers: [],
			followings: [],
			isAdmin: false,
			username: 'Test1',
			email: 'test1@test.com'
		}
	});
	// user tokens
	expect(response.body.user.tokens).toHaveLength(1);

	// user is exist
	const isUserExist = await User.findById(response.body.user._id);
	expect(isUserExist).not.toBeNull();
});

test('should login a exist user', async () => {
	const response = await request(app)
		.post('/api/auth/login')
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);

	// user is exist
	const isUserExist = await User.findById(response.body.user._id);
	expect(isUserExist).not.toBeNull();

	// exist user should have more than one (in this case 2)
	expect(response.body.user.tokens).toHaveLength(2);
});

test('should not login nonexistent user', async () => {
	const response = await request(app)
		.post('/api/auth/login')
		.send({
			email: 'UserNotFound@test.net',
			password: 'thisisarandompassword'
		})
		.expect(404);
});

test('should not login user for wrong password', async () => {
	await request(app)
		.post('/api/auth/login')
		.send({
			email: userOne.email,
			password: 'thisisarandompassword'
		})
		.expect(400);
});

