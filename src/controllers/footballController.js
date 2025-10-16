import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('football');
export const getFootball = c.getCategory;
export const listFootballProducts = c.listProducts;
export const getFootballProduct = c.getProduct;
export const adminUpdateFootballCategory = c.adminUpdateCategory;
export const adminCreateFootballProduct = c.adminCreateProduct;
export const adminUpdateFootballProduct = c.adminUpdateProduct;
export const adminDeleteFootballProduct = c.adminDeleteProduct;
