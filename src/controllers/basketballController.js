import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('basketball');
export const getBasketball = c.getCategory;
export const listBasketballProducts = c.listProducts;
export const getBasketballProduct = c.getProduct;
export const adminUpdateBasketballCategory = c.adminUpdateCategory;
export const adminCreateBasketballProduct = c.adminCreateProduct;
export const adminUpdateBasketballProduct = c.adminUpdateProduct;
export const adminDeleteBasketballProduct = c.adminDeleteProduct;
