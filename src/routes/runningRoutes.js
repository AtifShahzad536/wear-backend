import { Router } from 'express';
import {
  getRunning,
  listRunningProducts,
  getRunningProduct,
  adminUpdateRunningCategory,
  adminCreateRunningProduct,
  adminUpdateRunningProduct,
  adminDeleteRunningProduct,
} from '../controllers/runningController.js';

const router = Router();

// Public
router.get('/', getRunning);
router.get('/products', listRunningProducts);
router.get('/products/:id', getRunningProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateRunningCategory);
router.post('/admin/products', adminCreateRunningProduct);
router.put('/admin/products/:id', adminUpdateRunningProduct);
router.delete('/admin/products/:id', adminDeleteRunningProduct);

export default router;
