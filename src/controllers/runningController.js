import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('running');
export const getRunning = c.getCategory;
export const listRunningProducts = c.listProducts;
export const getRunningProduct = c.getProduct;
export const adminUpdateRunningCategory = c.adminUpdateCategory;
export const adminCreateRunningProduct = c.adminCreateProduct;
export const adminUpdateRunningProduct = c.adminUpdateProduct;
export const adminDeleteRunningProduct = c.adminDeleteProduct;
