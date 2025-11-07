const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const { UserModel } = require("../models/user.model");
const API_URLS = require("./api-urls.config");

require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id); // store user ID in session
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.getUserById(id);
  done(null, user);
});

// 🔗 Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: API_URLS.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await UserModel.getUserByEmail(email);
          if (!user) {
            user = await UserModel.createUser({
              name: profile.displayName,
              email,
              oauthProvider: "google",
              oauthId: profile.id,
              avatarUrl: profile.photos?.[0]?.value,
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log("✅ Google OAuth strategy configured");
} else {
  console.log("⚠️ Google OAuth not configured - skipping Google strategy");
}

// 🧑‍💻 GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: API_URLS.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.com`;
          let user = await UserModel.getUserByEmail(email);
          if (!user) {
            user = await UserModel.createUser({
              name: profile.displayName || profile.username,
              email,
              oauthProvider: "github",
              oauthId: profile.id,
              avatarUrl: profile.photos?.[0]?.value,
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log("✅ GitHub OAuth strategy configured");
} else {
  console.log("⚠️ GitHub OAuth not configured - skipping GitHub strategy");
}

// 👔 LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: API_URLS.LINKEDIN_CALLBACK_URL,
        scope: ["openid", "profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await UserModel.getUserByEmail(email);
          if (!user) {
            user = await UserModel.createUser({
              name: profile.displayName,
              email,
              oauthProvider: "linkedin",
              oauthId: profile.id,
              avatarUrl: profile.photos?.[0]?.value,
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log("✅ LinkedIn OAuth strategy configured");
} else {
  console.log("⚠️ LinkedIn OAuth not configured - skipping LinkedIn strategy");
}

module.exports = passport;