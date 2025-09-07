/**
 * ---------------------------------
 * File: token-generator.utils.js
 * Description:
 * This class provides functionality for generating, signing, and refreshing JWTs (JSON Web Tokens).
 * It can be used to securely create and manage tokens for authentication and authorization purposes.
 * 
 * Key Features:
 * - **Signing Tokens**: Generates JWTs by signing payloads with a secret/private key.
 * - **Refreshing Tokens**: Allows the refreshing of an existing JWT by verifying and re-signing it.
 * - **Custom Expiry**: Configurable expiration for tokens (defaults to 1 hour).
 * - **Symmetric or Asymmetric Encryption**: Supports both symmetric (same key for signing and verifying) and asymmetric encryption (separate signing and verifying keys).
 * 
 * Methods:
 * - `sign(payload, signOptions)`: Signs a payload and returns a JWT.
 * - `refresh(token, refreshOptions)`: Refreshes an existing token by verifying and re-signing it, optionally with new options.
 * 
 * Dependencies:
 * - `jsonwebtoken`: A library for signing, verifying, and decoding JWTs.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The constructor requires a `secretOrPrivateKey` for signing tokens, and optionally, a `secretOrPublicKey` for verification.
 * - The refresh method allows modifying the payload while retaining the token's essential properties.
 * ---------------------------------
 */


const jwt = require("jsonwebtoken");

class TokenGenerator {
  /**
   * Creates an instance of the TokenGenerator class.
   * 
   * @param {string} secretOrPrivateKey - The secret or private key used for signing tokens.
   * @param {string} [secretOrPublicKey] - The secret or public key used for verifying tokens (optional for symmetric encryption).
   * @param {object} [options] - Optional configuration for the token expiration and other properties.
   */
  constructor(secretOrPrivateKey, secretOrPublicKey, options = {}) {
    if (!secretOrPrivateKey) {
      throw new Error("Secret key for signing is required.");
    }
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey || secretOrPrivateKey; // Allow same key for symmetric encryption
    this.options = { expiresIn: "1h", ...options }; // Default to 1 hour expiry
  }

  /**
   * Signs a payload to generate a JWT.
   * 
   * @param {object} payload - The payload to be signed in the JWT.
   * @param {object} [signOptions] - Optional signing options (e.g., `expiresIn`).
   * @returns {string} - The signed JWT.
   */
  sign(payload, signOptions = {}) {
    const jwtSignOptions = { ...this.options, ...signOptions };
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  /**
   * Refreshes an existing JWT by verifying and re-signing it.
   * 
   * @param {string} token - The JWT to be refreshed.
   * @param {object} [refreshOptions] - Optional options for verification and signing the refreshed token.
   * @returns {string} - The new refreshed JWT.
   * @throws {Error} - Throws an error if the token is invalid or expired.
   */
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
