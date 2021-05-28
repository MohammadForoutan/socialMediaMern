const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')

// Update user
router.put('/:id', userController.updateUser)
// Delete user
router.delete('/:id', userController.deleteUser)
// Get a user
router.get('/', userController.getUser)
// Follow a user
router.put('/:id/follow', userController.followUser)
// UnFollow a user
router.put('/:id/unfollow', userController.unFollowUser)
// Get Followings
router.get('/followings/:id', userController.getUserFollowings)

module.exports = router;