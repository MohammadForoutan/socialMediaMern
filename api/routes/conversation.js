const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversation');
const { verify } = require('../middlewares/auth');

// new conversation
router.post('/', verify, conversationController.createConversation);
// get conversations of a user
router.get('/:userId', verify, conversationController.getConversations);

module.exports = router;
