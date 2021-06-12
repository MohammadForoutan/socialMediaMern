const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
	const { senderId, receiverId } = req.body;
	// create new conversation
	const newConversation = new Conversation({
		members: [senderId, receiverId]
	});

	try {
		const savedConversation = await newConversation.save();
		res.status(200).json(savedConversation);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getConversations = async (req, res) => {
	const userId = req.user._id;
	try {
		// find conversation and members(populate)
		const conversations = await Conversation.find({
			members: { $in: [userId] }
		}).populate({model: 'User', path: 'members'});
		// send conversations
		res.status(200).json(conversations);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
