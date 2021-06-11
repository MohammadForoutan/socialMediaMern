const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
	// create new Message
	const message = { sender, text, conversationId } = req.body;
	const newMessage = new Message(message);
	try {
		// save message
		const savedMessage = await newMessage.save();
		res.status(200).json('Message saved');
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params;
		// find messages of a conversation
		const messages = await Message.find({ conversationId });
		res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
