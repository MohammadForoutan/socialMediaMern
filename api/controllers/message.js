const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
	const newMessage = new Message(req.body);
	try {
		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const messages = await Message.find({ conversationId });
    res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
