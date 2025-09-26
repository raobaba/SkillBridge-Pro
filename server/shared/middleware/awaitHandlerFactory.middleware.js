


const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { logger } = require("shared/utils/logger.utils");


// Factory function that wraps middleware in an async handler
/**
 * This function wraps an Express middleware function to handle async operations.
 * It also ensures that the encryption key is available and handles errors.
 */
const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      const key = process.env.SECRET_CRYPTO;

      if (!key) {
        throw { status: 500, message: "Encryption key is missing" };
      }

      // if (req.body?.data) {
      //   req.body = decrypt(req.body.data, key);
      // }

      await middleware(req, res, next);
    } catch (err) {
      console.error("[❌ ERROR] Await Handler:", err);
      logger.error(`${req.method} ${req.originalUrl} ${err.status || 500} - ${err.message}`);
      next(err);
    }
  };
};

// Function to encrypt data using AES encryption
/**
 * Encrypts data using AES algorithm and a provided encryption key.
 * @param {Object} data - The data to encrypt.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted data as a string.
 */
const encrypt = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Function to decrypt data using AES decryption
/**
 * Decrypts encrypted data using AES algorithm and a provided decryption key.
 * @param {string} encryptedData - The encrypted data to decrypt.
 * @param {string} key - The decryption key.
 * @returns {Object} - The decrypted data as a parsed JSON object.
 * @throws {Object} - Throws an error if decryption fails.
 */
const decrypt = (encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedText);
  } catch (error) {
    throw { status: 400, message: "Invalid encrypted data" };
  }
};

module.exports = awaitHandlerFactory;
