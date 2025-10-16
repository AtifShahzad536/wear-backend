import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('bags');
export const getBags = c.getCategory;
export const listBagsProducts = c.listProducts;
export const getBagsProduct = c.getProduct;
export const adminUpdateBagsCategory = c.adminUpdateCategory;
export const adminCreateBagsProduct = c.adminCreateProduct;
export const adminUpdateBagsProduct = c.adminUpdateProduct;
export const adminDeleteBagsProduct = c.adminDeleteProduct;
