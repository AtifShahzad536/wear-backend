import { Router } from 'express';
import { listCategories, getCategory, getProduct, getHome } from '../controllers/categoryController.js';

const router = Router();

router.get('/categories', listCategories);
router.get('/category/:slug', getCategory);
router.get('/product/:id', getProduct);
router.get('/home', getHome);

export default router;
