import { Router } from 'express';
import {
  getRugby,
  listRugbyProducts,
  getRugbyProduct,
  adminUpdateRugbyCategory,
  adminCreateRugbyProduct,
  adminUpdateRugbyProduct,
  adminDeleteRugbyProduct,
} from '../controllers/rugbyController.js';

const router = Router();

// Public
router.get('/', getRugby);
router.get('/products', listRugbyProducts);
router.get('/products/:id', getRugbyProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateRugbyCategory);
router.post('/admin/products', adminCreateRugbyProduct);
router.put('/admin/products/:id', adminUpdateRugbyProduct);
router.delete('/admin/products/:id', adminDeleteRugbyProduct);

export default router;
