const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')
const {verify} = require('../middlewares/auth')

// Update user
router.put('/:id', verify ,userController.updateUser)
// Delete user
router.delete('/:id', verify,userController.deleteUser)
// Get a user
router.get('/', userController.getUser)
// Follow a user
router.put('/:id/follow', verify,userController.followUser)
// UnFollow a user
router.put('/:id/unfollow', verify,userController.unFollowUser)
// Get Followings
router.get('/followings/:id', userController.getUserFollowings)

module.exports = router;