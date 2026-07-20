import { Router } from 'express';
import { Category } from '../models/Category.js';
import { Inquiry } from '../models/Inquiry.js';
import { BuilderModel } from '../models/BuilderModel.js';
import { BuilderPattern } from '../models/BuilderPattern.js';
import { BuilderLogo } from '../models/BuilderLogo.js';
// No direct HomeSettings usage in web routes; pages use API via client-side JS.

const router = Router();

router.get('/', async (req, res) => {
  const cats = await Category.find({}).lean();
  const totalProducts = cats.reduce((sum, c) => sum + (c.products?.length || 0), 0);
  // take last 8 products by array order across categories
  const recentProducts = cats
    .flatMap(c => (c.products || []).map(p => ({ ...p, category: c.slug, categoryName: c.name })))
    .slice(-8)
    .reverse();
  res.render('dashboard', {
    title: 'Admin Dashboard',
    stats: { categories: cats.length, products: totalProducts },
    recentProducts,
  });
});

// Categories
router.get('/categories', async (req, res) => {
  const cats = await Category.find({}, { __v: 0 }).lean();
  res.render('categories/list', { title: 'Categories', categories: cats });
});

router.get('/categories/new', (req, res) => {
  res.render('categories/new', { title: 'New Category' });
});

router.get('/categories/:slug/edit', async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug }).lean();
  if (!cat) return res.status(404).send('Category not found');
  res.render('categories/edit', { title: `Edit ${cat.name}`, category: cat });
});

// Uploads manager
router.get('/uploads', (req, res) => {
  res.render('uploads', { title: 'Uploads' });
});

// Note: the combined Home Settings page is intentionally removed to keep each section separate.
// Backward-compatible redirect for old link
router.get('/home/settings', (req, res) => {
  res.redirect('/admin/home/hero');
});

// Separate pages
router.get('/home/hero', (req, res) => {
  res.render('home/hero', { title: 'Home • Hero Images' });
});
router.get('/home/testimonials', (req, res) => {
  res.render('home/testimonials', { title: 'Home • Testimonials' });
});
router.get('/home/top-selling', (req, res) => {
  res.render('home/top', { title: 'Home • Top Selling' });
});

// Inquiries list (EJS)
router.get('/inquiries', async (req, res) => {
  const list = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
  res.render('inquiries/list', { title: 'Orders & Inquiries', inquiries: list });
});

// Inquiry Show (detail page)
router.get('/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).lean();
    if (!inquiry) return res.status(404).send('Inquiry not found');
    const success = req.query.success || null;
    res.render('inquiries/show', { title: `Order — ${inquiry.name}`, inquiry, success });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Inquiry PDF / Print page
router.get('/inquiries/:id/pdf', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).lean();
    if (!inquiry) return res.status(404).send('Inquiry not found');
    res.render('inquiries/pdf', { title: `PDF Invoice — ${inquiry.name}`, inquiry });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update inquiry status + admin note
router.post('/inquiries/:id/status', async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    await Inquiry.findByIdAndUpdate(req.params.id, { status, admin_note });
    res.redirect(`/admin/inquiries/${req.params.id}?success=Status+updated+successfully`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Products
router.get('/categories/:slug/products', async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug }).lean();
  if (!cat) return res.status(404).send('Category not found');
  res.render('products/list', { title: `${cat.name} • Products`, category: cat, products: cat.products || [] });
});

router.get('/categories/:slug/products/new', async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug }).lean();
  if (!cat) return res.status(404).send('Category not found');
  res.render('products/new', { title: `New Product • ${cat.name}`, category: cat });
});

router.get('/categories/:slug/products/:id/edit', async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug }).lean();
  if (!cat) return res.status(404).send('Category not found');
  const prod = (cat.products || []).find(p => p.id === req.params.id);
  if (!prod) return res.status(404).send('Product not found');
  res.render('products/edit', { title: `Edit Product • ${cat.name}`, category: cat, product: prod });
});

// Builder Models Web Pages
router.get('/builder-models', async (req, res) => {
  const models = await BuilderModel.find({}).sort({ createdAt: -1 }).lean();
  res.render('builder_models/list', { title: 'Builder Models', models });
});

router.get('/builder-models/new', async (req, res) => {
  const categories = await Category.find({}).lean();
  res.render('builder_models/new', { title: 'New Builder Model', categories });
});

router.get('/builder-models/:id/edit', async (req, res) => {
  const model = await BuilderModel.findById(req.params.id).lean();
  if (!model) return res.status(404).send('Builder model not found');
  const categories = await Category.find({}).lean();
  res.render('builder_models/edit', { title: `Edit Model • ${model.name}`, model, categories });
});

// Builder Patterns Web Pages
router.get('/builder-patterns', async (req, res) => {
  const patterns = await BuilderPattern.find({}).sort({ createdAt: -1 }).lean();
  res.render('builder_patterns/list', { title: 'Builder Patterns', patterns });
});

router.get('/builder-patterns/new', (req, res) => {
  res.render('builder_patterns/new', { title: 'New Builder Pattern' });
});

router.get('/builder-patterns/:id/edit', async (req, res) => {
  const pattern = await BuilderPattern.findById(req.params.id).lean();
  if (!pattern) return res.status(404).send('Builder pattern not found');
  res.render('builder_patterns/edit', { title: `Edit Pattern • ${pattern.name}`, pattern });
});

// Builder Logos Web Pages
router.get('/builder-logos', async (req, res) => {
  const logos = await BuilderLogo.find({}).sort({ createdAt: -1 }).lean();
  res.render('builder_logos/list', { title: 'Builder Logos', logos });
});

router.get('/builder-logos/new', (req, res) => {
  res.render('builder_logos/new', { title: 'New Builder Logo' });
});

router.get('/builder-logos/:id/edit', async (req, res) => {
  const logo = await BuilderLogo.findById(req.params.id).lean();
  if (!logo) return res.status(404).send('Builder logo not found');
  res.render('builder_logos/edit', { title: `Edit Logo • ${logo.name}`, logo });
});

export default router;
