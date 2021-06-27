const Message = require('../models/Message');
const { expressErrHandler } = require('../util/error');

exports.createMessage = async (req, res, next) => {
	// create new Message
	const { sender, text, conversationId } = req.body;
	const newMessage = new Message({ sender, text, conversationId });
	try {
		await newMessage.save();
		res.status(200).json('Message saved');
	} catch (err) {
		expressErrHandler(err, next);
	}
};

exports.getMessages = async (req, res, next) => {
	const { conversationId } = req.params;
	try {
		const messages = await Message.find({ conversationId });
		res.status(200).json(messages);
	} catch (err) {
		expressErrHandler(err, next);
	}
};
