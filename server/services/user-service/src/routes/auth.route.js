const express = require('express');
const passport = require('passport');
const authRouter = express.Router();

// 🌐 Google OAuth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  res.json({ success: true, message: 'Google login success', user: req.user });
});

// 🐱 GitHub OAuth
authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
authRouter.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
}), (req, res) => {
  res.json({ success: true, message: 'GitHub login success', user: req.user });
});

// 💼 LinkedIn OAuth
authRouter.get('/linkedin', passport.authenticate('linkedin'));
authRouter.get('/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect: '/login',
}), (req, res) => {
  res.json({ success: true, message: 'LinkedIn login success', user: req.user });
});

module.exports = authRouter;
