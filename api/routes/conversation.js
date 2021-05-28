const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversation')

// new conversation
router.post('/', conversationController.createConversation)
// get conversations of a user
router.get('/:userId', conversationController.getConversations)




// new conversation
// new conversation
// new conversation

module.exports = router;
