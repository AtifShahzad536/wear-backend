import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try { return jwt.verify(token, config.jwtSecret); } catch { return null; }
}

export function extractToken(req) {
  const h = req.headers['authorization'] || req.headers['Authorization'];
  if (h && typeof h === 'string' && h.startsWith('Bearer ')) return h.slice(7);
  const cookie = req.headers['cookie'] || '';
  const m = cookie.match(/(?:^|; )token=([^;]+)/);
  if (m) return decodeURIComponent(m[1]);
  return null;
}

export function requireAdmin(req, res, next) {
  const tok = extractToken(req);
  const data = tok ? verifyToken(tok) : null;
  if (!data || data.role !== 'admin') {
    // If it's an admin web request (HTML), redirect to login with unauth notice
    const accepts = String(req.headers['accept'] || '').toLowerCase();
    const wantsHtml = accepts.includes('text/html');
    const isAdminWeb = String(req.originalUrl || '').startsWith('/admin');
    if (wantsHtml || isAdminWeb) return res.redirect('/admin/login?unauth=1');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = data;
  next();
}

// Password helpers (salt:hash with pbkdf2)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, passwordHash) {
  const [salt, hash] = String(passwordHash).split(':');
  if (!salt || !hash) return false;
  const chk = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(chk, 'hex'));
}
