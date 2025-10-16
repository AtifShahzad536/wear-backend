import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('wrestling');
export const getWrestling = c.getCategory;
export const listWrestlingProducts = c.listProducts;
export const getWrestlingProduct = c.getProduct;
export const adminUpdateWrestlingCategory = c.adminUpdateCategory;
export const adminCreateWrestlingProduct = c.adminCreateProduct;
export const adminUpdateWrestlingProduct = c.adminUpdateProduct;
export const adminDeleteWrestlingProduct = c.adminDeleteProduct;
