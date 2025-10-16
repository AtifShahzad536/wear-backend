import { Router } from 'express';
import {
  getWrestling,
  listWrestlingProducts,
  getWrestlingProduct,
  adminUpdateWrestlingCategory,
  adminCreateWrestlingProduct,
  adminUpdateWrestlingProduct,
  adminDeleteWrestlingProduct,
} from '../controllers/wrestlingController.js';

const router = Router();

// Public
router.get('/', getWrestling);
router.get('/products', listWrestlingProducts);
router.get('/products/:id', getWrestlingProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateWrestlingCategory);
router.post('/admin/products', adminCreateWrestlingProduct);
router.put('/admin/products/:id', adminUpdateWrestlingProduct);
router.delete('/admin/products/:id', adminDeleteWrestlingProduct);

export default router;
