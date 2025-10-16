import { Router } from 'express';
import { Category } from '../models/Category.js';
import { Inquiry } from '../models/Inquiry.js';
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
  res.render('inquiries/list', { title: 'Inquiries', inquiries: list });
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

export default router;
