import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { Category } from '../models/Category.js';
import { categories as seedCategories } from '../models/data.js';
import { HomeSettings } from '../models/Home.js';
import { Inquiry } from '../models/Inquiry.js';
import fs from 'fs';
import path from 'path';
import { sendMail, isMailConfigured } from '../config/mail.js';

const router = Router();

function normalizeImageUrl(value) {
  if (!value) return '';
  let v = String(value).trim().replace(/\\/g, '/');
  if (/^https?:\/\//i.test(v)) return v;
  if (v && v[0] !== '/') v = '/' + v;
  if (v.startsWith('/images/')) v = v.replace('/images/', '/uploads/');
  if (!v.startsWith('/uploads/') && v.split('/').length === 2) {
    v = v.replace(/^\//, '/uploads/');
  }
  return v;
}

// Upload image
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    if (!isCloudinaryConfigured()) {
      const fileUrl = req.file.filename ? `/uploads/${req.file.filename}` : '';
      console.log('[Admin Upload] Cloudinary not configured, using local path', { fileUrl, filename: req.file.filename });
      return res.status(200).json({ url: fileUrl, filename: req.file.filename || '' });
    }

    const result = await uploadToCloudinary(req.file, { folder: 'wearconnect/admin' });
    console.log('[Admin Upload] Uploaded to Cloudinary', { publicId: result.public_id, url: result.secure_url });
    return res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload failed', err);
    res.status(500).json({ error: 'Upload failed', details: err?.message || String(err) });
  }
});

// List uploaded files (publicly accessible URLs)
router.get('/uploads', (req, res) => {
  try {
    const dir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) return res.json([]);
    const files = fs.readdirSync(dir)
      .filter(f => !f.startsWith('.'))
      .map(name => ({ name, url: `/uploads/${name}` }));
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list uploads' });
  }
});

// Categories CRUD (Mongo)
router.get('/categories', async (req, res) => {
  const list = await Category.find({}, { __v: 0 }).lean();
  res.json(list);
});

router.post('/categories', upload.none(), async (req, res) => {
  const { slug, name, gradientFrom, gradientTo, featured } = req.body;
  if (!slug || !name) return res.status(400).json({ error: 'slug and name are required' });
  const exists = await Category.findOne({ slug }).lean();
  if (exists) return res.status(409).json({ error: 'Category exists' });
  const created = await Category.create({ slug, name, gradientFrom, gradientTo, featured: featured || {}, products: [] });
  res.status(201).json(created);
});

router.put('/categories/:slug', upload.none(), async (req, res) => {
  const updated = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    { $set: req.body },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

// Support HTML form POST for update
router.post('/categories/:slug', upload.none(), async (req, res) => {
  const updated = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    { $set: req.body },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

router.delete('/categories/:slug', upload.none(), async (req, res) => {
  const removed = await Category.findOneAndDelete({ slug: req.params.slug }).lean();
  if (!removed) return res.status(404).json({ error: 'Category not found' });
  res.json(removed);
});

// Support HTML form POST for category delete
router.post('/categories/:slug/delete', upload.none(), async (req, res) => {
  const removed = await Category.findOneAndDelete({ slug: req.params.slug }).lean();
  if (!removed) return res.status(404).json({ error: 'Category not found' });
  res.json(removed);
});

// Products CRUD under a category
router.post('/categories/:slug/products', upload.none(), async (req, res) => {
  const { id, name, image = '', description } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  if ((cat.products||[]).some(p => p.id === id)) return res.status(409).json({ error: 'Product id exists' });
  const normalizedImage = normalizeImageUrl(image);
  const prod = { id, name, image: normalizedImage, description: description || '' };
  cat.products = cat.products || [];
  cat.products.push(prod);
  await cat.save();
  res.status(201).json(prod);
});

router.put('/categories/:slug/products/:id', upload.none(), async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const idx = (cat.products||[]).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const updates = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(updates, 'image')) {
    updates.image = normalizeImageUrl(updates.image);
  }
  Object.assign(cat.products[idx], updates);
  await cat.save();
  res.json(cat.products[idx]);
});

// Support HTML form POST for product update
router.post('/categories/:slug/products/:id', upload.none(), async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const idx = (cat.products||[]).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const updates = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(updates, 'image')) {
    updates.image = normalizeImageUrl(updates.image);
  }
  Object.assign(cat.products[idx], updates);
  await cat.save();
  res.json(cat.products[idx]);
});

router.delete('/categories/:slug/products/:id', upload.none(), async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const idx = (cat.products||[]).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const [removed] = cat.products.splice(idx, 1);
  await cat.save();
  res.json(removed);
});

// Support HTML form POST for delete
router.post('/categories/:slug/products/:id/delete', upload.none(), async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const idx = (cat.products||[]).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const [removed] = cat.products.splice(idx, 1);
  await cat.save();
  res.json(removed);
});

// Seed initial categories into MongoDB (use once)
router.post('/seed', async (req, res) => {
  try {
    const ops = seedCategories.map(c =>
      Category.updateOne(
        { slug: c.slug },
        {
          $set: {
            slug: c.slug,
            name: c.name,
            gradientFrom: c.gradientFrom || '',
            gradientTo: c.gradientTo || '',
            featured: c.featured || {},
            products: c.products || [],
          }
        },
        { upsert: true }
      )
    );
    const results = await Promise.all(ops);
    const total = await Category.countDocuments();
    res.json({ ok: true, upserts: results.length, total });
  } catch (err) {
    console.error('Seed failed', err);
    res.status(500).json({ error: 'Seed failed', details: err.message });
  }
});

// Home settings (hero images, testimonials, etc.)
router.get('/home', async (req, res) => {
  const doc = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  res.json(doc);
});

router.put('/home', upload.none(), async (req, res) => {
  // Accept heroImages (array), testimonials (array of {name,role,image,quote}), partners (array), valueProps (array of {title,body}), topSelling
  const payload = req.body || {};
  const parseMaybeJSON = (v) => {
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return v; }
    }
    return v;
  };
  const update = {
    heroImages: parseMaybeJSON(payload.heroImages) || [],
    testimonials: parseMaybeJSON(payload.testimonials) || [],
    partners: parseMaybeJSON(payload.partners) || [],
    valueProps: parseMaybeJSON(payload.valueProps) || [],
    topSelling: parseMaybeJSON(payload.topSelling) || [],
  };
  const doc = await HomeSettings.findOneAndUpdate(
    { key: 'default' },
    { $set: update, $setOnInsert: { key: 'default' } },
    { new: true, upsert: true }
  ).lean();
  res.json(doc);
});

// Inquiries (admin)
router.get('/inquiries', async (req, res) => {
  try {
    const list = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list inquiries', details: err.message });
  }
});

router.delete('/inquiries/:id', async (req, res) => {
  try {
    const removed = await Inquiry.findByIdAndDelete(req.params.id).lean();
    if (!removed) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry', details: err.message });
  }
});

// Temporary: SMTP mail test
router.get('/mail-test', async (req, res) => {
  try {
    if (!isMailConfigured()) {
      return res.status(400).json({ ok: false, error: 'Mail not configured. Check BREVO_* in .env' });
    }
    await sendMail({ subject: 'WearConnect Mail Test', text: 'This is a test email from WearConnect.', html: '<b>This is a test email from WearConnect.</b>' });
    res.json({ ok: true, message: 'Test email requested. Check inbox/spam.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;

