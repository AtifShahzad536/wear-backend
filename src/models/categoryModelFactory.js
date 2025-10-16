import { categories } from './data.js';

export function makeCategoryModel(slug) {
  function getCategory() {
    return categories.find(c => c.slug === slug) || null;
  }
  function updateCategory(patch) {
    const cat = getCategory();
    if (!cat) return null;
    Object.assign(cat, patch);
    return cat;
  }
  function listProducts() {
    const cat = getCategory();
    return (cat?.products) || [];
  }
  function findProduct(id) {
    return listProducts().find(p => p.id === id) || null;
  }
  function addProduct(product) {
    const cat = getCategory();
    if (!cat) return null;
    cat.products = cat.products || [];
    cat.products.push(product);
    return product;
  }
  function updateProduct(id, patch) {
    const prod = findProduct(id);
    if (!prod) return null;
    Object.assign(prod, patch);
    return prod;
  }
  function removeProduct(id) {
    const cat = getCategory();
    if (!cat) return null;
    const idx = (cat.products||[]).findIndex(p => p.id === id);
    if (idx === -1) return null;
    const [removed] = cat.products.splice(idx, 1);
    return removed;
  }
  return { getCategory, updateCategory, listProducts, findProduct, addProduct, updateProduct, removeProduct };
}
