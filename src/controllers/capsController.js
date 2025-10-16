import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('caps');
export const getCaps = c.getCategory;
export const listCapsProducts = c.listProducts;
export const getCapsProduct = c.getProduct;
export const adminUpdateCapsCategory = c.adminUpdateCategory;
export const adminCreateCapsProduct = c.adminCreateProduct;
export const adminUpdateCapsProduct = c.adminUpdateProduct;
export const adminDeleteCapsProduct = c.adminDeleteProduct;
