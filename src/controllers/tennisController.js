import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('tennis');
export const getTennis = c.getCategory;
export const listTennisProducts = c.listProducts;
export const getTennisProduct = c.getProduct;
export const adminUpdateTennisCategory = c.adminUpdateCategory;
export const adminCreateTennisProduct = c.adminCreateProduct;
export const adminUpdateTennisProduct = c.adminUpdateProduct;
export const adminDeleteTennisProduct = c.adminDeleteProduct;
