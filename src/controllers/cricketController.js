import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('cricket');
export const getCricket = c.getCategory;
export const listCricketProducts = c.listProducts;
export const getCricketProduct = c.getProduct;
export const adminUpdateCricketCategory = c.adminUpdateCategory;
export const adminCreateCricketProduct = c.adminCreateProduct;
export const adminUpdateCricketProduct = c.adminUpdateProduct;
export const adminDeleteCricketProduct = c.adminDeleteProduct;
