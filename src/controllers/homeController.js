import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('home');
export const getHome = c.getCategory;
export const listHomeProducts = c.listProducts;
export const getHomeProduct = c.getProduct;
export const adminUpdateHomeCategory = c.adminUpdateCategory;
export const adminCreateHomeProduct = c.adminCreateProduct;
export const adminUpdateHomeProduct = c.adminUpdateProduct;
export const adminDeleteHomeProduct = c.adminDeleteProduct;
