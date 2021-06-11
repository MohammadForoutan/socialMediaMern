const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			min: 2,
			max: 20,
			unique: true
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 80
		},
		avatar: {
			type: String,
			default: ''
		},
		cover: {
			type: String,
			default: ''
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		followings: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		isAdmin: {
			type: Boolean,
			default: false
		},
		about: {
			type: String,
			max: 70
		},
		city: {
			type: String,
			max: 50
		},
		from: {
			type: String,
			max: 50
		},
		relationship: {
			type: String
		},
		tokens: [
			{
				type: String,
				required: true
			}
		]
	},
	/* model options */
	{ timestamps: true }
);

UserSchema.methods.generateAuthToken = async function () {
	const user = this;

	// payload
	const payload = {
		_id: user._id.toString()
	};

	try {
		// sign token
		const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFE
		});

		// save token
		user.tokens = user.tokens.concat(token)
		await user.save();

		// return token
		return token;
	} catch (err) {
		console.log(err);
	}
};

UserSchema.methods.logout = async function (currentSessionToken) {
  const user = this;
  user.tokens = user.tokens.filter(token => token !== currentSessionToken)
  await user.save();
}

UserSchema.methods.logoutAll = async function() {
  try {
    const user = this;

    user.tokens = [];
    await user.save();
    
  } catch (err) {
    console.log(err);
  }
} 
const User = mongoose.model('User', UserSchema);

module.exports = User;
