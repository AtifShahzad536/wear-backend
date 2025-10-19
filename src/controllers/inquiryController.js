import { Inquiry } from '../models/Inquiry.js';
import { sendMail } from '../config/mail.js';
import fs from 'fs';
import path from 'path';

// Public: create a custom inquiry (optionally with uploaded file)
export async function createCustomInquiry(req, res) {
  try {
    const { name, email, phone = '', company = '', message = '', fileUrl = '' } = req.body || {};
    let uploadedUrl = req.file ? `/uploads/${req.file.filename || ''}` : '';
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' });
    const doc = await Inquiry.create({ type: 'custom', name, email, phone, company, message, fileUrl: uploadedUrl || fileUrl });
    // Prepare attachment if file in uploads exists
    let attachments = [];
    let inlineImgHtml = '';
    if (req.file) {
      const filename = req.file.originalname || req.file.filename || 'design-file';
      const baseFilename = filename.replace(/[^a-z0-9\-_.]/gi, '_');
      if (req.file.buffer) {
        attachments = [{ filename: baseFilename, content: req.file.buffer, cid: 'design@wearconnect' }];
        inlineImgHtml = `<p><b>Attached design:</b><br/><img src="cid:design@wearconnect" style="max-width:600px;border:1px solid #eee;border-radius:6px"/></p>`;
      } else if (uploadedUrl && uploadedUrl.startsWith('/uploads/')) {
        const resolvedName = uploadedUrl.split('/').pop();
        const absPath = path.resolve(process.cwd(), 'uploads', resolvedName);
        if (fs.existsSync(absPath)) {
          attachments = [{ filename: baseFilename, path: absPath, cid: 'design@wearconnect' }];
          inlineImgHtml = `<p><b>Attached design:</b><br/><img src="cid:design@wearconnect" style="max-width:600px;border:1px solid #eee;border-radius:6px"/></p>`;
        }
      }
    }
    // Notify via email (if SMTP configured)
    await sendMail({
      subject: `New Custom Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nMessage: ${message}`,
      html: `<h3>New Custom Inquiry</h3>
             <p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Phone:</b> ${phone}<br/><b>Company:</b> ${company}</p>
             <p><b>Message:</b><br/>${message.replace(/\n/g,'<br/>')}</p>
             ${inlineImgHtml || (doc.fileUrl ? `<p><b>File (link):</b> <a href="${doc.fileUrl}">${doc.fileUrl}</a></p>` : '')}
            `,
      attachments,
      replyTo: email,
    });
    res.status(201).json(doc.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
}

// Public: create a contact inquiry
export async function createContactInquiry(req, res) {
  try {
    const { name, email, phone = '', message = '' } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' });
    const doc = await Inquiry.create({ type: 'contact', name, email, phone, message });
    await sendMail({
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `<h3>New Contact Message</h3><p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Phone:</b> ${phone}</p><p><b>Message:</b><br/>${message.replace(/\n/g,'<br/>')}</p>`,
      replyTo: email,
    });
    res.status(201).json(doc.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
}

// Admin: list inquiries
export async function listInquiries(req, res) {
  const list = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
}

// Admin: delete inquiry
export async function deleteInquiry(req, res) {
  const removed = await Inquiry.findByIdAndDelete(req.params.id).lean();
  if (!removed) return res.status(404).json({ error: 'Inquiry not found' });
  res.json(removed);
}
