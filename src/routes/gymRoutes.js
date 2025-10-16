import { Router } from 'express';
import {
  getGym,
  listGymProducts,
  getGymProduct,
  adminUpdateGymCategory,
  adminCreateGymProduct,
  adminUpdateGymProduct,
  adminDeleteGymProduct,
} from '../controllers/gymController.js';

const router = Router();

// Public
router.get('/', getGym);
router.get('/products', listGymProducts);
router.get('/products/:id', getGymProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateGymCategory);
router.post('/admin/products', adminCreateGymProduct);
router.put('/admin/products/:id', adminUpdateGymProduct);
router.delete('/admin/products/:id', adminDeleteGymProduct);

export default router;
