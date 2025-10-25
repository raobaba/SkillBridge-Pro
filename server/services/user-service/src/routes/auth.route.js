const express = require("express");
const passport = require("passport");
const authRouter = express.Router();

const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

// 🌐 Google OAuth
authRouter.get(
  "/google",
  (req, res, next) => {
    // Store redirect_to in session for callback
    if (req.query.redirect_to) {
      req.session.redirect_to = req.query.redirect_to;
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/auth` }),
  (req, res) => {
    // Get redirect URL from session or default to dashboard
    const redirectUrl = req.session.redirect_to ? 
      `${FRONTEND_URL}${decodeURIComponent(req.session.redirect_to)}` : 
      `${FRONTEND_URL}/dashboard`;
    
    // Clear the redirect from session
    delete req.session.redirect_to;
    
    res.redirect(redirectUrl);
  }
);

// 🐱 GitHub OAuth
authRouter.get(
  "/github",
  (req, res, next) => {
    // Store redirect_to in session for callback
    if (req.query.redirect_to) {
      req.session.redirect_to = req.query.redirect_to;
    }
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${FRONTEND_URL}/auth` }),
  (req, res) => {
    // Get redirect URL from session or default to dashboard
    const redirectUrl = req.session.redirect_to ? 
      `${FRONTEND_URL}${decodeURIComponent(req.session.redirect_to)}` : 
      `${FRONTEND_URL}/dashboard`;
    
    // Clear the redirect from session
    delete req.session.redirect_to;
    
    res.redirect(redirectUrl);
  }
);

// 💼 LinkedIn OAuth
authRouter.get(
  "/linkedin",
  (req, res, next) => {
    // Store redirect_to in session for callback
    if (req.query.redirect_to) {
      req.session.redirect_to = req.query.redirect_to;
    }
    next();
  },
  passport.authenticate("linkedin")
);

authRouter.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: `${FRONTEND_URL}/auth`,
  }),
  (req, res) => {
    // Get redirect URL from session or default to dashboard
    const redirectUrl = req.session.redirect_to ? 
      `${FRONTEND_URL}${decodeURIComponent(req.session.redirect_to)}` : 
      `${FRONTEND_URL}/dashboard`;
    
    // Clear the redirect from session
    delete req.session.redirect_to;
    
    res.redirect(redirectUrl);
  }
);

module.exports = authRouter;
