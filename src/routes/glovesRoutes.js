import { Router } from 'express';
import {
  getGloves,
  listGlovesProducts,
  getGlovesProduct,
  adminUpdateGlovesCategory,
  adminCreateGlovesProduct,
  adminUpdateGlovesProduct,
  adminDeleteGlovesProduct,
} from '../controllers/glovesController.js';

const router = Router();

// Public
router.get('/', getGloves);
router.get('/products', listGlovesProducts);
router.get('/products/:id', getGlovesProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateGlovesCategory);
router.post('/admin/products', adminCreateGlovesProduct);
router.put('/admin/products/:id', adminUpdateGlovesProduct);
router.delete('/admin/products/:id', adminDeleteGlovesProduct);

export default router;
