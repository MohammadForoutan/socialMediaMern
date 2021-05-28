const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
	const { senderId, receiverId } = req.body;
	try {
		const newConversation = new Conversation({
			members: [senderId, receiverId]
		});
		const savedConversation = await newConversation.save();
		res.status(200).json(savedConversation);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getConversations = async (req, res) => {
	try {
		const { userId } = req.params;
		const conversations = await Conversation.find({
			members: { $in: [userId] }
		}).populate({model: 'User', path: 'members'});
		res.status(200).json(conversations);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
