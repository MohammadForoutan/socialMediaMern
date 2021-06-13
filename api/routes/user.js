const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const userController = require('../controllers/user')
const {verify} = require('../middlewares/auth')

// Update user
router.put('/:id', verify , [
  body('email').isEmail().normalizeEmail().toLowerCase(),
  body('password').isLength({min: 6}),
  body('username').isLength({min: 2})
],userController.updateUser)
// Delete user
router.delete('/:id', verify,userController.deleteUser)
// Get a user
router.get('/', userController.getUser)
// search along users
router.get('/search', userController.searchUsers)
// Follow a user
router.put('/:id/follow', verify,userController.followUser)
// UnFollow a user
router.put('/:id/unfollow', verify,userController.unFollowUser)
// Get Followings
router.get('/followings/:id', userController.getUserFollowings)

module.exports = router;