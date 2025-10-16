import { Router } from 'express';
import { User } from '../models/User.js';
import { hashPassword, verifyPassword, signToken } from '../middleware/auth.js';

const router = Router();

// Simple in-memory rate limit store: email -> { fails, until }
const loginAttempts = new Map();
const MAX_FAILS = 3;
const LOCK_MINUTES = 10; // 10 minutes cool-down
function isLocked(email) {
  const rec = loginAttempts.get(email);
  if (!rec) return false;
  if (rec.until && Date.now() < rec.until) return true;
  if (rec.until && Date.now() >= rec.until) { loginAttempts.delete(email); return false; }
  return false;
}
function recordFail(email) {
  const rec = loginAttempts.get(email) || { fails: 0, until: 0 };
  rec.fails += 1;
  if (rec.fails >= MAX_FAILS) {
    rec.until = Date.now() + LOCK_MINUTES * 60 * 1000;
  }
  loginAttempts.set(email, rec);
}
function recordSuccess(email) { loginAttempts.delete(email); }

// Seed an admin user: POST { email, password }
router.post('/seed-admin', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const exists = await User.findOne({ email }).lean();
  if (exists) return res.json({ ok: true, message: 'Admin already exists' });
  const user = await User.create({ email, passwordHash: hashPassword(password), role: 'admin' });
  res.json({ ok: true, id: user._id });
});

// JSON login: POST { email, password } -> { token }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const user = await User.findOne({ email }).lean();
  const valid = !!user && verifyPassword(password || '', user.passwordHash);
  if (valid) {
    // Success always overrides lock; reset attempts and login
    recordSuccess(email);
    const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
    return res.json({ token, role: user.role, email: user.email });
  }
  // Invalid credentials
  if (isLocked(email)) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  recordFail(email);
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Web login for EJS form: sets cookie and redirects
router.post('/login-web', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Missing email or password');
  const user = await User.findOne({ email }).lean();
  const valid = !!user && verifyPassword(password || '', user.passwordHash);
  if (valid) {
    recordSuccess(email);
    const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
    res.cookie('token', token, { httpOnly: false, sameSite: 'lax', path: '/' });
    return res.redirect('/admin');
  }
  if (isLocked(email)) return res.status(429).send('Too many attempts. Try again later.');
  recordFail(email);
  return res.status(401).send('Invalid credentials');
});

export default router;
