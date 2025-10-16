import { Router } from 'express';
import {
  getFootball,
  listFootballProducts,
  getFootballProduct,
  adminUpdateFootballCategory,
  adminCreateFootballProduct,
  adminUpdateFootballProduct,
  adminDeleteFootballProduct,
} from '../controllers/footballController.js';

const router = Router();

// Public
router.get('/', getFootball);
router.get('/products', listFootballProducts);
router.get('/products/:id', getFootballProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateFootballCategory);
router.post('/admin/products', adminCreateFootballProduct);
router.put('/admin/products/:id', adminUpdateFootballProduct);
router.delete('/admin/products/:id', adminDeleteFootballProduct);

export default router;
