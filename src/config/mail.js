import { Resend } from 'resend';
import { promises as fs } from 'fs';
import path from 'path';

const {
  RESEND_API_KEY = '',
  RESEND_FROM = '',
  RESEND_TO = '',
} = process.env;

let client = null;

function getClient() {
  if (!client && RESEND_API_KEY) {
    client = new Resend(RESEND_API_KEY);
  }
  return client;
}

export function isMailConfigured() {
  return Boolean(RESEND_API_KEY && RESEND_FROM && (RESEND_TO || RESEND_FROM));
}

async function normalizeAttachments(list = []) {
  if (!Array.isArray(list) || !list.length) return [];
  const attachments = await Promise.all(list.map(async (item) => {
    const filePath = item?.path;
    if (!filePath) return null;
    try {
      const fileBuffer = await fs.readFile(filePath);
      return {
        filename: item.filename || path.basename(filePath),
        content: fileBuffer.toString('base64'),
      };
    } catch (err) {
      console.warn('[Mail] attachment read failed:', err?.message || err);
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

  const resend = getClient();
  if (!resend) {
    console.error('[Mail] Resend client not initialized');
    return;
  }

  try {
    const toList = (RESEND_TO || RESEND_FROM)
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      from: RESEND_FROM,
      to: toList,
      subject,
    };

    if (replyTo) payload.reply_to = replyTo;
    if (html) payload.html = html;
    if (text) payload.text = text;

    const normalizedAttachments = await normalizeAttachments(attachments);
    if (normalizedAttachments.length) {
      payload.attachments = normalizedAttachments;
    }

    await resend.emails.send(payload);
  } catch (err) {
    console.error('[Mail] send failed:', err?.message || err);
  }
}
