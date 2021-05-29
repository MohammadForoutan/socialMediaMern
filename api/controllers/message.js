const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
	// create new Message
	const newMessage = new Message(req.body);
	try {
		// save message
		const savedMessage = await newMessage.save();
		// send message
		res.status(200).json(savedMessage);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getMessages = async (req, res) => {
	try {
		// get data
		const { conversationId } = req.params;
		// find messages of a conversation
		const messages = await Message.find({ conversationId });
		// send messages
    res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
