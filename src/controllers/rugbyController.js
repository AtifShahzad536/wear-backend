import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('rugby');
export const getRugby = c.getCategory;
export const listRugbyProducts = c.listProducts;
export const getRugbyProduct = c.getProduct;
export const adminUpdateRugbyCategory = c.adminUpdateCategory;
export const adminCreateRugbyProduct = c.adminCreateProduct;
export const adminUpdateRugbyProduct = c.adminUpdateProduct;
export const adminDeleteRugbyProduct = c.adminDeleteProduct;
