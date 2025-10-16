import { makeCategoryController } from './categoryControllerFactory.js';

const c = makeCategoryController('hockey');
export const getHockey = c.getCategory;
export const listHockeyProducts = c.listProducts;
export const getHockeyProduct = c.getProduct;
export const adminUpdateHockeyCategory = c.adminUpdateCategory;
export const adminCreateHockeyProduct = c.adminCreateProduct;
export const adminUpdateHockeyProduct = c.adminUpdateProduct;
export const adminDeleteHockeyProduct = c.adminDeleteProduct;
