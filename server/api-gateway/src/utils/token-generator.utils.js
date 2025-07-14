

const jwt = require("jsonwebtoken");

class TokenGenerator {

  constructor(secretOrPrivateKey, secretOrPublicKey, options = {}) {
    if (!secretOrPrivateKey) {
      throw new Error("Secret key for signing is required.");
    }
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey || secretOrPrivateKey; // Allow same key for symmetric encryption
    this.options = { expiresIn: "1h", ...options }; // Default to 1 hour expiry
  }

  sign(payload, signOptions = {}) {
    const jwtSignOptions = { ...this.options, ...signOptions };
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  refresh(token, refreshOptions = {}) {
    try {
      const payload = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify || {});
      const newPayload = { ...payload }; // Allow modifications if needed

      delete newPayload.iat;
      delete newPayload.exp;
      delete newPayload.nbf;
      delete newPayload.jti;

      const jwtSignOptions = { ...this.options, jwtid: refreshOptions.jwtid };
      return jwt.sign(newPayload, this.secretOrPrivateKey, jwtSignOptions);
    } catch (error) {
      console.error("JWT refresh error:", error.message);
      throw new Error("Invalid or expired token.");
    }
  }
}

module.exports = TokenGenerator;
