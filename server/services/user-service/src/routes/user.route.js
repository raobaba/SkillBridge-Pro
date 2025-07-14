const express = require('express');
const userController = require('../controllers/user.controller');
const userRouter = express.Router();
const authenticate = require('../middleware/auth.middleware'); 

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/profile', authenticate, userController.getUserProfile);
userRouter.put('/profile', authenticate, userController.updateUserProfile);
userRouter.delete('/profile', authenticate, userController.deleteUser);
userRouter.get('/verify-email/:id', userController.verifyEmail);
userRouter.put('/oauth', authenticate, userController.updateOAuth);

module.exports = userRouter;
