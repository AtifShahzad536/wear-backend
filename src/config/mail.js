import nodemailer from 'nodemailer';

const {
  SMTP_HOST = '',
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER = '',
  SMTP_PASS = '',
  SMTP_FROM = '',
  SMTP_TO = '',
} = process.env;

let transporter = null;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === 'true',
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    // Optional: verify once, non-blocking
    transporter.verify().then(() => {
      console.log('[Mail] transporter verified');
    }).catch(err => {
      console.warn('[Mail] transporter verify failed:', err?.message || err);
    });
  }
  return transporter;
}

export function isMailConfigured() {
  return Boolean(SMTP_HOST && (SMTP_USER || SMTP_FROM) && (SMTP_TO || SMTP_USER));
}

// subject, text/html are required. replyTo is optional (e.g., end-user email)
export async function sendMail({ subject, text, html, replyTo, attachments }) {
  try {
    if (!isMailConfigured()) {
      console.warn('[Mail] not configured, skipping send');
      return;
    }
    const t = getTransporter();
    const from = SMTP_FROM || SMTP_USER;
    // Support comma/semicolon separated list for SMTP_TO
    const toList = (SMTP_TO || SMTP_USER)
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    const message = { from, to: toList, subject };
    if (replyTo) message.replyTo = replyTo;
    if (html) message.html = html;
    if (text) message.text = text;
    if (attachments && Array.isArray(attachments) && attachments.length) message.attachments = attachments;
    await t.sendMail(message);
  } catch (err) {
    console.error('[Mail] send failed:', err?.message || err);
  }
}
