import { Router } from 'express';
import {
  getShoes,
  listShoesProducts,
  getShoesProduct,
  adminUpdateShoesCategory,
  adminCreateShoesProduct,
  adminUpdateShoesProduct,
  adminDeleteShoesProduct,
} from '../controllers/shoesController.js';

const router = Router();

// Public
router.get('/', getShoes);
router.get('/products', listShoesProducts);
router.get('/products/:id', getShoesProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateShoesCategory);
router.post('/admin/products', adminCreateShoesProduct);
router.put('/admin/products/:id', adminUpdateShoesProduct);
router.delete('/admin/products/:id', adminDeleteShoesProduct);

export default router;
