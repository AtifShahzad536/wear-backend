import { categories } from './data.js';

const slug = 'football';

export function getCategory() {
  return categories.find(c => c.slug === slug) || null;
}

export function updateCategory(patch) {
  const cat = getCategory();
  if (!cat) return null;
  Object.assign(cat, patch);
  return cat;
}

export function listProducts() {
  const cat = getCategory();
  return (cat?.products) || [];
}

export function findProduct(id) {
  return listProducts().find(p => p.id === id) || null;
}

export function addProduct(product) {
  const cat = getCategory();
  if (!cat) return null;
  cat.products = cat.products || [];
  cat.products.push(product);
  return product;
}

export function updateProduct(id, patch) {
  const prod = findProduct(id);
  if (!prod) return null;
  Object.assign(prod, patch);
  return prod;
}

export function removeProduct(id) {
  const cat = getCategory();
  if (!cat) return null;
  const idx = (cat.products||[]).findIndex(p => p.id === id);
  if (idx === -1) return null;
  const [removed] = cat.products.splice(idx, 1);
  return removed;
}
