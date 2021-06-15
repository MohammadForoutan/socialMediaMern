const request = require('supertest');
const app = require('../app');
const User = require('../models/User.js');
const { setupDatabase, userOne } = require('./fixtures/db');

beforeEach(async () => {
	await setupDatabase();
});

// login
test("should not login cause email format isn't correct", async () => {
	const response = await request(app)
		.post('/api/auth/login')
		.send({
			username: 'Test1',
			email: 'TEST1test.com',
			password: 'asdasdsd'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('email');
});

test('should not login cauese password has less than 6 character', async () => {
	const response = await request(app)
		.post('/api/auth/login')
		.send({
			username: 'Test1',
			email: 'TEST1@test.com',
			password: 'asdf'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('password');
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

test('should not login cause password is wrong', async () => {
	await request(app)
		.post('/api/auth/login')
		.send({
			email: userOne.email,
			password: 'thisisarandompassword'
		})
		.expect(400);
});

test("should not login cause user isn't exist", async () => {
	await request(app)
		.post('/api/auth/login')
		.send({
			email: 'UserNotFound@test.net',
			password: 'thisisarandompassword'
		})
		.expect(404);
});

// register
test('should register a new user', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'Teasdasdst1',
			email: 'TEST1@test.com',
			password: '12345678',
			confirmPassword: '12345678'
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
			username: 'Teasdasdst1',
			email: 'test1@test.com'
		}
	});
	// user tokens
	expect(response.body.user.tokens).toHaveLength(1);

	// user is exist
	const isUserExist = await User.findById(response.body.user._id);
	expect(isUserExist).not.toBeNull();
});

test('should not register cause username is already exist', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: userOne.username,
			email: 'TEST1@test.com',
			password: 'asdfasdfsdafasdf',
			confirmPassword: 'asdfasdfsdafasdf'
		})
		.expect(400);

	expect(response.body.errors[0].param).toEqual('username');
});

test('should not register cause username has lass than 2 charater', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'a',
			email: 'TEST1@test.com',
			password: 'asdfasdfsdafasdf',
			confirmPassword: 'asdfasdfsdafasdf'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('username');
});

test('should not register cause email is not email', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'hello',
			email: 'TEST1test.com',
			password: 'asdfasdfsdafasdf',
			confirmPassword: 'asdfasdfsdafasdf'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('email');
});

test('should not register cause email is already exist', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'hello',
			email: userOne.email,
			password: 'asdfasdfsdafasdf',
			confirmPassword: 'asdfasdfsdafasdf'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('email');
});

test('should not register cause password is less than 6 character', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'hello',
			email: 'asdasd@asdas.asdas',
			password: '12345',
			confirmPassword: '12345'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('password');
});

test('should not register cause password and confirm-password are not match', async () => {
	const response = await request(app)
		.post('/api/auth/register')
		.send({
			username: 'hello',
			email: 'asdasd@asdas.asdas',
			password: '123456',
			confirmPassword: '12345678'
		})
		.expect(400);
	expect(response.body.errors[0].param).toEqual('confirmPassword');
});

// logout
test('should logout user and remove token', async () => {
	const token = userOne.tokens[0].token;
	await request(app)
		.post('/api/auth/logout')
		.set('Authorization', `Bearer ${token}`)
		.send()
		.expect(200);

	expect(userOne.tokens[0]).not.toEqual(token);
});

test('should logout user and remove token', async () => {
	await request(app).post('/api/auth/logout').send().expect(403);
});

// logoutAll

test('should logoutAll users and remove all tokens', async () => {
	const token = userOne.tokens[0].token;
	await request(app)
		.post('/api/auth/logoutAll')
		.set('Authorization', `Bearer ${token}`)
		.send()
		.expect(200);

	const user = await User.findById(userOne._id);
	expect(Array.from(user.tokens)).toEqual([]); // Array.from => because mongoose array not equal simple array
});
