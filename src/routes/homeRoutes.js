import { Router } from 'express';
import {
  getHome,
  listHomeProducts,
  getHomeProduct,
  adminUpdateHomeCategory,
  adminCreateHomeProduct,
  adminUpdateHomeProduct,
  adminDeleteHomeProduct,
} from '../controllers/homeController.js';
import { HomeSettings } from '../models/Home.js';

const router = Router();

// Public
router.get('/', getHome);
router.get('/products/:id', getHomeProduct);
router.get('/topSelling', async (req, res) => {
  const doc = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  res.json({ topSelling: doc.topSelling || [] });
});
router.get('/settings', async (req, res) => {
  const doc = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  res.json({
    heroImages: doc.heroImages || [],
    testimonials: doc.testimonials || [],
    partners: doc.partners || [],
    valueProps: doc.valueProps || [],
    topSelling: doc.topSelling || [],
  });
});

// Admin (CRUD)
router.put('/admin', adminUpdateHomeCategory);
router.post('/admin/products', adminCreateHomeProduct);
router.put('/admin/products/:id', adminUpdateHomeProduct);
router.delete('/admin/products/:id', adminDeleteHomeProduct);

export default router;
