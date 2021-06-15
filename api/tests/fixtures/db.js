const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	username: 'Mohammad',
	email: 'mohammad@gmail.com',
	password: 'mohammadIsPassword',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.ACCESS_TOKEN_SECRET)
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	username: 'Ali',
	email: 'ali@gmail.com',
	password: 'aliIsPassword',
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.ACCESS_TOKEN_SECRET)
		}
	]
};

const userAdminId = new mongoose.Types.ObjectId();
const userAdmin = {
	_id: userAdminId,
	username: 'Admin',
	email: 'admin@gmail.com',
	password: 'adminIsPassword',
	isAdmin: true,
	tokens: [
		{
			token: jwt.sign({ _id: userAdminId }, process.env.ACCESS_TOKEN_SECRET)
		}
	]
};

const setupDatabase = async () => {
	await User.deleteMany();
	user = new User(userOne);
	user2 = new User(userTwo);
	superUser = new User(userAdmin);
	await user.generateAuthToken();
	await user2.generateAuthToken();
	await superUser.generateAuthToken();
};

module.exports = {
	setupDatabase,
	userOne,
	userTwo,
	userAdmin,
	userOneId
};
