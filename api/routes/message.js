const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const messageController = require('../controllers/message');

// new message
router.post('/', verify, [body('text').trim().isLength({min: 1})], messageController.createMessage);

// get all messages of a conversations
router.get('/:conversationId', verify, messageController.getMessages);

module.exports = router;
