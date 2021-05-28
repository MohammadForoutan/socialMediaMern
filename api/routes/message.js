const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message')

// new message
router.post('/', messageController.createMessage)

// get all messages of a conversations
router.get('/:conversationId', messageController.getMessages)

module.exports = router;