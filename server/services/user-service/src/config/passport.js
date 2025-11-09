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
  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
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

// 🧑‍💻 GitHub OAuth Strategy (for authentication)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    "github",
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

// 🧑‍💻 GitHub OAuth Strategy for Portfolio Sync (stores tokens in database)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  try {
    const { PortfolioSyncModel } = require("../models/portfolio-sync.model");
    
    passport.use(
      "github-portfolio-sync",
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: API_URLS.GITHUB_CALLBACK_URL, // Use same callback URL as regular auth
          scope: ["user:email", "repo", "read:user"],
          passReqToCallback: true, // Enable access to req in callback
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            // Get userId from session (set during initiation)
            const userId = req.session?.portfolioSyncUserId || null;
            
            if (!userId) {
              return done(new Error("User ID not found in session. Please ensure you're logged in."), null);
            }

            // Store tokens in database
            await PortfolioSyncModel.upsertIntegrationToken(userId, "github", {
              accessToken,
              refreshToken: refreshToken || null,
              tokenType: "Bearer",
              expiresAt: null, // GitHub tokens don't expire by default
              scope: "user:email,repo,read:user",
              platformUserId: profile.id.toString(),
              platformUsername: profile.username,
              isActive: true,
            });

            // Clear session data
            delete req.session.portfolioSyncUserId;

            // Return profile with userId for redirect handler
            profile.userId = userId;
            done(null, profile);
          } catch (error) {
            console.error("Error storing GitHub tokens:", error);
            done(error, null);
          }
        }
      )
    );
    console.log("✅ GitHub Portfolio Sync OAuth strategy configured");
    console.log("   Callback URL:", API_URLS.GITHUB_CALLBACK_URL);
  } catch (error) {
    console.error("❌ Error configuring GitHub Portfolio Sync OAuth strategy:", error);
  }
} else {
  console.warn("⚠️  GitHub Portfolio Sync OAuth strategy not configured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set");
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