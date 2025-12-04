const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../../utils/jwt.util');

const ACCESS_TOKEN_MAX_AGE_MS = 1000 * 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    const payload = { userId: user.id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE_MS });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE_MS });

    return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Register error:', err);
    if (err?.name === 'PrismaClientInitializationError' || (err?.message && err.message.includes("Can't reach database server"))) {
      return res.status(503).json({ error: 'Database unavailable. Ensure the database server is running and DATABASE_URL is set.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { userId: user.id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE_MS });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE_MS });

    return res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Login error:', err);
    if (err?.name === 'PrismaClientInitializationError' || (err?.message && err.message.includes("Can't reach database server"))) {
      return res.status(503).json({ error: 'Database unavailable. Ensure the database server is running and DATABASE_URL is set.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}


async function logout(req, res) {
  try {
    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    if (err?.name === 'PrismaClientInitializationError' || (err?.message && err.message.includes("Can't reach database server"))) {
      return res.status(503).json({ error: 'Database unavailable. Ensure the database server is running and DATABASE_URL is set.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(401).json({ error: 'Invalid refresh token' });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const newAccess = signAccessToken({ userId: user.id });
    res.cookie('accessToken', newAccess, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE_MS });

    return res.json({ accessToken: newAccess });
  } catch (err) {
    console.error('Refresh error:', err);
    if (err?.name === 'PrismaClientInitializationError' || (err?.message && err.message.includes("Can't reach database server"))) {
      return res.status(503).json({ error: 'Database unavailable. Ensure the database server is running and DATABASE_URL is set.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('getMe error:', err);
    if (err?.name === 'PrismaClientInitializationError' || (err?.message && err.message.includes("Can't reach database server"))) {
      return res.status(503).json({ error: 'Database unavailable. Ensure the database server is running and DATABASE_URL is set.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to database
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // In a real app, send email here
    // For now, just return success
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  forgotPassword,
};