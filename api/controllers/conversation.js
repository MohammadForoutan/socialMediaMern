const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
	const { senderId, receiverId } = req.body;

	const existConversation = await Conversation.findOne({
		members: [senderId, receiverId]
	});
	if(!existConversation) {
		// create new conversation
		const conversation = new Conversation({
			members: [senderId, receiverId]
		});
		const newConversation = await conversation.save();
		res.status(200).json(newConversation);

	} else {
		console.log('conversation exist');
		res.status(200).json(existConversation);
	}
};

exports.getConversations = async (req, res) => {
	const userId = req.user._id;
	try {
		// find conversation and members(populate)
		const conversations = await Conversation.find({
			members: { $in: [userId] }
		}).populate({ model: 'User', path: 'members' });
		// send conversations
		res.status(200).json(conversations);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
