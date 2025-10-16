import { Router } from 'express';
import {
  getCaps,
  listCapsProducts,
  getCapsProduct,
  adminUpdateCapsCategory,
  adminCreateCapsProduct,
  adminUpdateCapsProduct,
  adminDeleteCapsProduct,
} from '../controllers/capsController.js';

const router = Router();

// Public
router.get('/', getCaps);
router.get('/products', listCapsProducts);
router.get('/products/:id', getCapsProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateCapsCategory);
router.post('/admin/products', adminCreateCapsProduct);
router.put('/admin/products/:id', adminUpdateCapsProduct);
router.delete('/admin/products/:id', adminDeleteCapsProduct);

export default router;
