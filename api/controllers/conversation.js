const Conversation = require('../models/Conversation');
const { expressErrHandler } = require('../util/error');

exports.createConversation = async (req, res, next) => {
	const { senderId, receiverId } = req.body;

	try {
		const existConversation = await Conversation.findOne({
			members: { $all: [senderId, receiverId] },
		});

		if (existConversation) {
			return res.status(200).json(existConversation);
		}

		// create new conversation
		const conversation = new Conversation({
			members: [senderId, receiverId],
		});
		const newConversation = await conversation.save();
		res.status(200).json(newConversation);
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getConversations = async (req, res, next) => {
	const userId = req.user._id;
	try {
		// find conversation and members(populate)
		const conversations = await Conversation.find({
			members: { $in: [userId] },
		}).populate({ model: 'User', path: 'members' });

		res.status(200).json(conversations);
	} catch (err) {
		expressErrHandler(err, next);
	}
};
