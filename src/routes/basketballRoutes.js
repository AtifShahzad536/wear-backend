import { Router } from 'express';
import {
  getBasketball,
  listBasketballProducts,
  getBasketballProduct,
  adminUpdateBasketballCategory,
  adminCreateBasketballProduct,
  adminUpdateBasketballProduct,
  adminDeleteBasketballProduct,
} from '../controllers/basketballController.js';

const router = Router();

// Public
router.get('/', getBasketball);
router.get('/products', listBasketballProducts);
router.get('/products/:id', getBasketballProduct);

// Admin (CRUD)
router.put('/admin', adminUpdateBasketballCategory);
router.post('/admin/products', adminCreateBasketballProduct);
router.put('/admin/products/:id', adminUpdateBasketballProduct);
router.delete('/admin/products/:id', adminDeleteBasketballProduct);

export default router;
