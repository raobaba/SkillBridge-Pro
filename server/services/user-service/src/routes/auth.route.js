const express = require("express");
const passport = require("passport");
const authRouter = express.Router();

const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

// 🌐 Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    // Optional: you can pass token or user ID in query params if needed
    res.redirect(`${FRONTEND_URL}`);
  }
);

// 🐱 GitHub OAuth
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}`);
  }
);

// 💼 LinkedIn OAuth
authRouter.get("/linkedin", passport.authenticate("linkedin"));

authRouter.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}`);
  }
);

module.exports = authRouter;
