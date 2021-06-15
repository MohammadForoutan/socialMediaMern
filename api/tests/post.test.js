const request = require('supertest');
const app = require('../app');
const User = require('../models/User.js');
const { setupDatabase, userOne, userOneId } = require('./fixtures/db');



beforeEach(async() => {
	await setupDatabase()
});


// get posts
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
