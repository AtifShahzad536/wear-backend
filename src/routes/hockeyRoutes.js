import { Router } from 'express';
import {
  getHockey,
  listHockeyProducts,
  getHockeyProduct,
  adminUpdateHockeyCategory,
  adminCreateHockeyProduct,
  adminUpdateHockeyProduct,
  adminDeleteHockeyProduct,
} from '../controllers/hockeyController.js';

const router = Router();

// Public
router.get('/', getHockey);
router.get('/products', listHockeyProducts);
router.get('/products/:id', getHockeyProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateHockeyCategory);
router.post('/admin/products', adminCreateHockeyProduct);
router.put('/admin/products/:id', adminUpdateHockeyProduct);
router.delete('/admin/products/:id', adminDeleteHockeyProduct);

export default router;
