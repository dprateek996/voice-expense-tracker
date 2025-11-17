// src/utils/password.util.js

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Validate password requirements
 * - Minimum 8 characters
 */
const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  return { valid: true };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePassword,
};
