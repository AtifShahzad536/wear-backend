import { Category } from '../models/Category.js';

export function makeCategoryController(slug) {
  return {
    // Public
    getCategory: async (req, res) => {
      const cat = await Category.findOne({ slug }).lean();
      if (!cat) return res.status(404).json({ error: `${slug} category not found` });
      res.json(cat);
    },
    listProducts: async (req, res) => {
      const cat = await Category.findOne({ slug }, { products: 1, _id: 0 }).lean();
      res.json(cat?.products || []);
    },
    getProduct: async (req, res) => {
      const cat = await Category.findOne({ slug }, { products: 1, _id: 0 }).lean();
      const prod = (cat?.products || []).find(p => p.id === req.params.id);
      if (!prod) return res.status(404).json({ error: 'Product not found' });
      res.json(prod);
    },

    // Admin
    adminUpdateCategory: async (req, res) => {
      const updated = await Category.findOneAndUpdate(
        { slug },
        { $set: req.body },
        { new: true, upsert: true }
      ).lean();
      res.json(updated);
    },
    adminCreateProduct: async (req, res) => {
      const { id, name, image = '', description = '' } = req.body || {};
      if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
      const cat = await Category.findOne({ slug });
      if (!cat) return res.status(404).json({ error: `${slug} category not found` });
      if ((cat.products || []).some(p => p.id === id)) return res.status(409).json({ error: 'Product id exists' });
      cat.products = cat.products || [];
      cat.products.push({ id, name, image, description });
      await cat.save();
      res.status(201).json({ id, name, image, description });
    },
    adminUpdateProduct: async (req, res) => {
      const { id } = req.params;
      const cat = await Category.findOne({ slug });
      if (!cat) return res.status(404).json({ error: `${slug} category not found` });
      const idx = (cat.products || []).findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      Object.assign(cat.products[idx], req.body || {});
      await cat.save();
      res.json(cat.products[idx]);
    },
    adminDeleteProduct: async (req, res) => {
      const { id } = req.params;
      const cat = await Category.findOne({ slug });
      if (!cat) return res.status(404).json({ error: `${slug} category not found` });
      const idx = (cat.products || []).findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      const [removed] = cat.products.splice(idx, 1);
      await cat.save();
      res.json(removed);
    }
  };
}
