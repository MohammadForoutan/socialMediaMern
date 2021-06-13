const request = require('supertest');
const app = require('../app');
const User = require('../models/User.js');
const {setupDatabase, userOne, userOneId} = require('./fixtures/db')


beforeEach(async() => {
	await setupDatabase()
});

test('should get profile for user with USERNAME', async () => {
	await request(app)
		.get('/api/users/?username=' + userOne.username)
		.send()
		.expect(200);
});

test('should get profile for user with USER_ID', async () => {
	await request(app)
		.get('/api/users/?userId=' + userOneId)
		.send()
		.expect(200);
});

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

test('should upload image', async () => {
	await request(app)
		.post('/api/upload')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('file', 'tests/fixtures/profile-pic.jpg')
		.field('name', 'file')
		.expect(200);

	// test is updated successfully
	const user = await User.findById(userOneId);

	expect(user.avatar).toEqual(expect.any(String));
});

test('should update valid field of user(in this case username)', async () => {
	await request(app)
		.put(`/api/users/${userOneId}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			username: 'thisIsTestName'
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.username).toBe('thisIsTestName');
});

test('should not update inValid field of user(in this case location)', async () => {
	await request(app)
		.put(`/api/users/${userOneId}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'newLocation'
		})
		.expect(400);
});