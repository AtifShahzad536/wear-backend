import { Category } from '../models/Category.js';
import { HomeSettings } from '../models/Home.js';

export const listCategories = async (req, res) => {
  const list = await Category.find({}, { slug: 1, name: 1, _id: 0 }).lean();
  res.json(list);
};

export const getCategory = async (req, res) => {
  const { slug } = req.params;
  const cat = await Category.findOne({ slug }).lean();
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findOne(
    { 'products.id': id },
    { _id: 0, name: 1, slug: 1, 'products.$': 1 }
  ).lean();
  const prod = cat?.products?.[0];
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  // Optionally include category reference
  res.json({ ...prod, category: cat.slug, categoryName: cat.name });
};

export const getHome = async (req, res) => {
  const cats = await Category.find({}, { slug: 1, name: 1, featured: 1, products: { $slice: 1 } })
    .limit(12)
    .lean();
  const quickCategories = cats.map(c => ({
    slug: c.slug,
    name: c.name,
    image: c?.featured?.image || (c?.products?.[0]?.image || ''),
  }));
  const home = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  res.json({
    quickCategories,
    heroImages: Array.isArray(home.heroImages) && home.heroImages.length ? home.heroImages : ['/uploads/slide1.jpg','/uploads/slide2.jpg'],
    testimonials: Array.isArray(home.testimonials) ? home.testimonials : [],
    partners: ['Club One', 'Elite Sports', 'ProGear', 'SwiftWear', 'Prime Kits'],
    valueProps: [
      { title: 'Export-Grade Quality', body: 'Durable fabrics, precise stitching, and long-lasting sublimation prints.' },
      { title: 'Customizations', body: 'Logos, names, numbers, and full team colorways available.' },
      { title: 'Global Shipping', body: 'Reliable delivery and support for clubs and distributors worldwide.' },
    ],
  });
};
