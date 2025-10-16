import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('gym');
export const getGym = c.getCategory;
export const listGymProducts = c.listProducts;
export const getGymProduct = c.getProduct;
export const adminUpdateGymCategory = c.adminUpdateCategory;
export const adminCreateGymProduct = c.adminCreateProduct;
export const adminUpdateGymProduct = c.adminUpdateProduct;
export const adminDeleteGymProduct = c.adminDeleteProduct;
