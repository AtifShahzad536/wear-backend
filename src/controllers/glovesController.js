import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('gloves');
export const getGloves = c.getCategory;
export const listGlovesProducts = c.listProducts;
export const getGlovesProduct = c.getProduct;
export const adminUpdateGlovesCategory = c.adminUpdateCategory;
export const adminCreateGlovesProduct = c.adminCreateProduct;
export const adminUpdateGlovesProduct = c.adminUpdateProduct;
export const adminDeleteGlovesProduct = c.adminDeleteProduct;
