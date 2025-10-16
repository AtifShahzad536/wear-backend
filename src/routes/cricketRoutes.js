import { Router } from 'express';
import {
  getCricket,
  listCricketProducts,
  getCricketProduct,
  adminUpdateCricketCategory,
  adminCreateCricketProduct,
  adminUpdateCricketProduct,
  adminDeleteCricketProduct,
} from '../controllers/cricketController.js';

const router = Router();

// Public
router.get('/', getCricket);
router.get('/products', listCricketProducts);
router.get('/products/:id', getCricketProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateCricketCategory);
router.post('/admin/products', adminCreateCricketProduct);
router.put('/admin/products/:id', adminUpdateCricketProduct);
router.delete('/admin/products/:id', adminDeleteCricketProduct);

export default router;
