import { Router } from 'express';
import {
  getBags,
  listBagsProducts,
  getBagsProduct,
  adminUpdateBagsCategory,
  adminCreateBagsProduct,
  adminUpdateBagsProduct,
  adminDeleteBagsProduct,
} from '../controllers/bagsController.js';

const router = Router();

// Public
router.get('/', getBags);
router.get('/products', listBagsProducts);
router.get('/products/:id', getBagsProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateBagsCategory);
router.post('/admin/products', adminCreateBagsProduct);
router.put('/admin/products/:id', adminUpdateBagsProduct);
router.delete('/admin/products/:id', adminDeleteBagsProduct);

export default router;
