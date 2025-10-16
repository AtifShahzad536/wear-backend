import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('shoes');
export const getShoes = c.getCategory;
export const listShoesProducts = c.listProducts;
export const getShoesProduct = c.getProduct;
export const adminUpdateShoesCategory = c.adminUpdateCategory;
export const adminCreateShoesProduct = c.adminCreateProduct;
export const adminUpdateShoesProduct = c.adminUpdateProduct;
export const adminDeleteShoesProduct = c.adminDeleteProduct;
