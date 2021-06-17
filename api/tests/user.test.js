const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const {
	setupDatabase,
	userOne,
	userOneId,
	userTwo,
	userAdmin
} = require('./fixtures/db');

beforeEach(async () => {
	await setupDatabase();
});

// get user
test('should get profile for user with USERNAME', async () => {
	const response = await request(app)
		.get('/api/users/?username=' + userOne.username)
		.send()
		.expect(200);

	expect(response.body.username).toBe(userOne.username);
	expect(response.body._id.toString()).toBe(userOneId.toString());
});

test('should get profile for user with USER_ID', async () => {
	const response = await request(app)
		.get('/api/users/?userId=' + userOneId)
		.send()
		.expect(200);
	expect(response.body.username).toBe(userOne.username);
	expect(response.body._id.toString()).toBe(userOneId.toString());
});

test('should not get profile for user with fake data', async () => {
	await request(app).get(`/api/users/username=fakeUsername`).expect(404);
});

// updateUser
test('should upload profile image', async () => {
	await request(app)
		.post('/api/upload')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('file', 'tests/fixtures/profile-pic.jpg')
		.field('name', 'file')
		.expect(200);

	// test is updated successfully
	const user = await User.findById(userOneId);
	expect(user.avatar.length).toBeGreaterThan(5);
});

// -- email
test('should update valid field - email', async () => {
	const { email, username } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email,
			username,
			email: 'email@mail.com'
		})
		.expect(200);

	const user = await User.findById(userOne._id);

	expect(user.email).toBe('email@mail.com');
	expect(user.username).toBe(userOne.username);
});

test('should not update unValid email', async () => {
	const { username } = userOne;
	await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			username,
			email: 'thisIsTestNamemail.com'
		})
		.expect(400);
});

test('should not update email cause is already exist', async () => {
	const { username } = userOne;
	await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			username,
			email: 'Ali@gmail.com'
		})
		.expect(400);
});

// -- password
test('should not update password cause length is less than 6', async () => {
	const { username, email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			username,
			email,
			password: '12345'
		})
		.expect(400);
});

test('should update password ', async () => {
	const { username, email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			username,
			email,
			password: '12345s'
		})
		.expect(200);

	const user = await User.findById(userOne._id);
	const isMatch = await bcrypt.compare('12345s', user.password);
	expect(isMatch).toEqual(true);
});

// -- username
test('should update username field', async () => {
	const { email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email,
			username: 'thisIsTestName'
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.username).toBe('thisIsTestName');
});

test('should not update username field cause username is short', async () => {
	const { username, email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email,
			username: 't'
		})
		.expect(400);
});

test('should not update username field cause username is already exist', async () => {
	const { email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email,
			username: 'Ali'
		})
		.expect(400);
});

// -- isAdmin
test("should not update user data cause he's not owner or admin", async () => {
	const { email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOneId}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send({
			email: userTwo.email,
			username: 'newUsername'
		})
		.expect(403);
});

// -- invalid field
test('should not update inValid field - location', async () => {
	await request(app)
		.put(`/api/users/${userOneId}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'newLocation'
		})
		.expect(400);
});

test('should not update isAdmin field - invalid feild', async () => {
	const { email } = userOne;
	const response = await request(app)
		.put(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email,
			username: 'Alia',
			isAdmin: true
		})
		.expect(400);
});

// -- delete user
test('should delete user - user yourself', async () => {
	const response = await request(app)
		.delete(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

	const user = await User.findById(userOne._id);
	expect(user).toEqual(null);
});

test('should delete user - admin', async () => {
	const response = await request(app)
		.delete(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userAdmin.tokens[0].token}`)
		.expect(200);

	const user = await User.findById(userOne._id);
	expect(user).toEqual(null);
});

test('should not delete user - Forbidden user', async () => {
	const response = await request(app)
		.delete(`/api/users/${userOne._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.expect(403);
});

// -- search-user
test('should find a user - userOne', async () => {
	const response = await request(app)
		.get(`/api/users/search?username=${userOne.username}`)
		.expect(200);

	const user = { ...response.body[0], _id: response.body[0]._id.toString() };
	expect(response.body[0]).toEqual({
		avatar: '',
		_id: userOne._id.toString(),
		username: 'Mohammad',
		email: 'mohammad@gmail.com',
		username: 'Mohammad'
	});
});

test('should find a user - userOne', async () => {
	const response = await request(app)
		.get(`/api/users/search?username=""`)
		.expect(200);

	expect(response.body).toEqual([]);
});

// -- follow-user
test('should follow a user', async () => {
	const response = await request(app)
		.put(`/api/users/${userTwo._id}/follow`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

	const user = await User.findById(userOne._id);
	const contact = await User.findById(userTwo._id);

	expect(user.followings[0].toString()).toEqual(userTwo._id.toString());
	expect(contact.followers[0].toString()).toEqual(userOne._id.toString());
});

// -- unfollow-user
test('should unfollow a user', async () => {
	// follow first
	await request(app)
		.put(`/api/users/${userTwo._id}/follow`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

	const user = await User.findById(userOne._id);
	const contact = await User.findById(userTwo._id);

	expect(user.followings[0].toString()).toEqual(userTwo._id.toString());
	expect(contact.followers[0].toString()).toEqual(userOne._id.toString());

	// then unfollow
	await request(app)
		.put(`/api/users/${userTwo._id}/unfollow`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);

		const unFollowedUser = await User.findById(userOne._id);
		const unFollowedcontact = await User.findById(userTwo._id);
	expect(Array.from(unFollowedUser.followings)).toEqual([]);
	expect(Array.from(unFollowedUser.followers)).toEqual([]);
	expect(Array.from(unFollowedcontact.followers)).toEqual([]);
	expect(Array.from(unFollowedcontact.followers)).toEqual([]);
});

// -- get-followings