import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, isCloudinaryConfigured, generateCloudinarySignature } from '../config/cloudinary.js';
import { Category } from '../models/Category.js';
import { categories as seedCategories } from '../models/data.js';
import { HomeSettings } from '../models/Home.js';
import { Inquiry } from '../models/Inquiry.js';
import fs from 'fs';
import path from 'path';
import { sendMail, isMailConfigured } from '../config/mail.js';
import { BuilderModel } from '../models/BuilderModel.js';
import { BuilderPattern } from '../models/BuilderPattern.js';
import { BuilderLogo } from '../models/BuilderLogo.js';

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

// Get Cloudinary Upload Signature (Client-side direct upload)
router.get('/cloudinary-signature', async (req, res) => {
  try {
    const { folder = 'wearconnect/uploads' } = req.query;
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({ error: 'Cloudinary is not configured' });
    }
    const signatureData = generateCloudinarySignature(folder);
    res.json(signatureData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate signature', details: err.message });
  }
});

// Upload image
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    if (!isCloudinaryConfigured()) {
      if (process.env.VERCEL === '1') {
        return res.status(400).json({ error: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured on Vercel.' });
      }
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
  if ((cat.products || []).some(p => p.id === id)) return res.status(409).json({ error: 'Product id exists' });
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
  const idx = (cat.products || []).findIndex(p => p.id === req.params.id);
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
  const idx = (cat.products || []).findIndex(p => p.id === req.params.id);
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
  const idx = (cat.products || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const [removed] = cat.products.splice(idx, 1);
  await cat.save();
  res.json(removed);
});

// Support HTML form POST for delete
router.post('/categories/:slug/products/:id/delete', upload.none(), async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const idx = (cat.products || []).findIndex(p => p.id === req.params.id);
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

// Builder Models CRUD
router.get('/builder-models', async (req, res) => {
  const list = await BuilderModel.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post('/builder-models', upload.none(), async (req, res) => {
  try {
    const { category_id, name, model_url, thumbnail, mapping, layers_metadata, status } = req.body;
    if (!category_id || !name || !model_url) {
      return res.status(400).json({ error: 'category_id, name, and model_url are required' });
    }
    const parseJSON = (v) => {
      if (!v) return {};
      if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return {}; }
      }
      return v;
    };
    const created = await BuilderModel.create({
      category_id,
      name,
      model_url: normalizeImageUrl(model_url),
      thumbnail: normalizeImageUrl(thumbnail),
      mapping: parseJSON(mapping),
      layers_metadata: parseJSON(layers_metadata),
      status: status === 'false' ? false : true
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create builder model', details: err.message });
  }
});

router.put('/builder-models/:id', upload.none(), async (req, res) => {
  try {
    const updates = { ...req.body };
    const parseJSON = (v) => {
      if (!v) return {};
      if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return {}; }
      }
      return v;
    };
    if (updates.model_url) updates.model_url = normalizeImageUrl(updates.model_url);
    if (updates.thumbnail) updates.thumbnail = normalizeImageUrl(updates.thumbnail);
    if (updates.mapping) updates.mapping = parseJSON(updates.mapping);
    if (updates.layers_metadata) updates.layers_metadata = parseJSON(updates.layers_metadata);
    if (updates.status !== undefined) updates.status = updates.status === 'false' ? false : true;

    const updated = await BuilderModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Builder model not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update builder model', details: err.message });
  }
});

router.post('/builder-models/:id/delete', upload.none(), async (req, res) => {
  try {
    const removed = await BuilderModel.findByIdAndDelete(req.params.id).lean();
    if (!removed) return res.status(404).json({ error: 'Builder model not found' });
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete builder model', details: err.message });
  }
});

// Builder Patterns CRUD
router.get('/builder-patterns', async (req, res) => {
  const list = await BuilderPattern.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post('/builder-patterns', upload.none(), async (req, res) => {
  try {
    const { name, image_path, status } = req.body;
    if (!name || !image_path) {
      return res.status(400).json({ error: 'name and image_path are required' });
    }
    const created = await BuilderPattern.create({
      name,
      image_path: normalizeImageUrl(image_path),
      status: status === 'false' ? false : true
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create builder pattern', details: err.message });
  }
});

router.put('/builder-patterns/:id', upload.none(), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.image_path) updates.image_path = normalizeImageUrl(updates.image_path);
    if (updates.status !== undefined) updates.status = updates.status === 'false' ? false : true;

    const updated = await BuilderPattern.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Builder pattern not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update builder pattern', details: err.message });
  }
});

router.post('/builder-patterns/:id/delete', upload.none(), async (req, res) => {
  try {
    const removed = await BuilderPattern.findByIdAndDelete(req.params.id).lean();
    if (!removed) return res.status(404).json({ error: 'Builder pattern not found' });
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete builder pattern', details: err.message });
  }
});

// Builder Logos CRUD
router.get('/builder-logos', async (req, res) => {
  const list = await BuilderLogo.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post('/builder-logos', upload.none(), async (req, res) => {
  try {
    const { name, category, image_path, status } = req.body;
    if (!name || !image_path) {
      return res.status(400).json({ error: 'name and image_path are required' });
    }
    const created = await BuilderLogo.create({
      name,
      category: category || 'MISC. LOGOS',
      image_path: normalizeImageUrl(image_path),
      status: status === 'false' ? false : true
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create builder logo', details: err.message });
  }
});

router.put('/builder-logos/:id', upload.none(), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.image_path) updates.image_path = normalizeImageUrl(updates.image_path);
    if (updates.status !== undefined) updates.status = updates.status === 'false' ? false : true;

    const updated = await BuilderLogo.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Builder logo not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update builder logo', details: err.message });
  }
});

router.post('/builder-logos/:id/delete', upload.none(), async (req, res) => {
  try {
    const removed = await BuilderLogo.findByIdAndDelete(req.params.id).lean();
    if (!removed) return res.status(404).json({ error: 'Builder logo not found' });
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete builder logo', details: err.message });
  }
});

export default router;

