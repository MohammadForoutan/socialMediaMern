const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	username: 'Mohammad',
	email: 'mohammad@gmail.com',
	password: 'thisIsPassword',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.ACCESS_TOKEN_SECRET)
		}
	]
};

const setupDatabase = async () => {
	await User.deleteMany();
	user = new User(userOne);
	await user.generateAuthToken();
};



module.exports = {
  setupDatabase,
  userOne,
  userOneId
}