import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';

const {
  SMTP_HOST: RAW_SMTP_HOST = '',
  SMTP_PORT: RAW_SMTP_PORT = '',
  SMTP_SECURE: RAW_SMTP_SECURE = '',
  SMTP_USER: RAW_SMTP_USER = '',
  SMTP_PASS: RAW_SMTP_PASS = '',
  SMTP_FROM_EMAIL: RAW_SMTP_FROM_EMAIL = '',
  SMTP_FROM_NAME: RAW_SMTP_FROM_NAME = '',
  SMTP_TO: RAW_SMTP_TO = '',
} = process.env;

const SMTP_HOST = RAW_SMTP_HOST.trim();
const SMTP_PORT = Number(RAW_SMTP_PORT) || 587;
const SMTP_SECURE = RAW_SMTP_SECURE.trim().toLowerCase() === 'false';
const SMTP_USER = RAW_SMTP_USER.trim();
const SMTP_PASS = RAW_SMTP_PASS.trim();
const SMTP_FROM_EMAIL = RAW_SMTP_FROM_EMAIL.trim();
const SMTP_FROM_NAME = RAW_SMTP_FROM_NAME.trim();
const SMTP_TO = RAW_SMTP_TO.trim();

let transporter = null;

function getTransporter() {
  if (!transporter && SMTP_HOST && SMTP_USER && SMTP_PASS) {
    console.log('[Mail] initializing SMTP transporter', { host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE });
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

export function isMailConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM_EMAIL && (SMTP_TO || SMTP_FROM_EMAIL));
}

async function normalizeAttachments(list = []) {
  if (!Array.isArray(list) || !list.length) return [];
  const attachments = await Promise.all(list.map(async (item) => {
    if (!item) return null;
    const filename = item.filename || 'attachment';

    if (item.content && Buffer.isBuffer(item.content)) {
      const normalized = { filename, content: item.content };
      if (item.cid) normalized.cid = item.cid;
      if (item.contentType) normalized.contentType = item.contentType;
      return normalized;
    }

    const filePath = item.path;
    if (!filePath) return null;
    try {
      await fs.access(filePath);
      const normalized = {
        filename: filename || path.basename(filePath),
        path: filePath,
      };
      if (item.cid) normalized.cid = item.cid;
      if (item.contentType) normalized.contentType = item.contentType;
      return normalized;
    } catch (err) {
      console.warn('[Mail] attachment access failed:', err?.message || err);
      return null;
    }
  }));
  return attachments.filter(Boolean);
}

// subject is required. Provide html/text as needed. replyTo optional.
export async function sendMail({ subject, text, html, replyTo, attachments }) {
  if (!isMailConfigured()) {
    console.warn('[Mail] not configured, skipping send');
    return;
  }

  console.log('[Mail] configuration snapshot', {
    host: SMTP_HOST || '(missing)',
    user: SMTP_USER ? '***set***' : '(missing)',
    from: SMTP_FROM_EMAIL || '(missing)',
    to: SMTP_TO || '(using from)'
  });

  const smtp = getTransporter();
  if (!smtp) {
    console.error('[Mail] SMTP transporter not initialized');
    return;
  }

  try {
    const toList = (SMTP_TO || SMTP_FROM_EMAIL)
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ');

    if (!toList) {
      console.warn('[Mail] no valid SMTP recipients resolved');
      return;
    }

    const normalizedAttachments = await normalizeAttachments(attachments);

    console.log('[Mail] sending via SMTP', { subject, to: toList, hasAttachments: Boolean(normalizedAttachments.length) });

    await smtp.sendMail({
      from: SMTP_FROM_NAME ? `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>` : SMTP_FROM_EMAIL,
      to: toList,
      subject,
      text,
      html,
      replyTo,
      attachments: normalizedAttachments.length ? normalizedAttachments : undefined,
    });
  } catch (err) {
    console.error('[Mail] send failed:', err?.message || err);
  }
}
