import { Router } from 'express';
import {
  getTennis,
  listTennisProducts,
  getTennisProduct,
  adminUpdateTennisCategory,
  adminCreateTennisProduct,
  adminUpdateTennisProduct,
  adminDeleteTennisProduct,
} from '../controllers/tennisController.js';

const router = Router();

// Public
router.get('/', getTennis);
router.get('/products', listTennisProducts);
router.get('/products/:id', getTennisProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateTennisCategory);
router.post('/admin/products', adminCreateTennisProduct);
router.put('/admin/products/:id', adminUpdateTennisProduct);
router.delete('/admin/products/:id', adminDeleteTennisProduct);

export default router;
