const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
	// Take Data
	const { senderId, receiverId } = req.body;
	// create new conversation
	const newConversation = new Conversation({
		members: [senderId, receiverId]
	});

	try {
		// save conversation
		const savedConversation = await newConversation.save();
		// return conversation
		res.status(200).json(savedConversation);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getConversations = async (req, res) => {
	try {
		// find conversation and members(populate)
		const conversations = await Conversation.find({
			members: { $in: [req.payload._id] }
		}).populate({model: 'User', path: 'members'});
		// send conversations
		res.status(200).json(conversations);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
