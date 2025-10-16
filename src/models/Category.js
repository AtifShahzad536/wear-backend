import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const FeaturedSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    details: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    gradientFrom: { type: String, default: '' },
    gradientTo: { type: String, default: '' },
    featured: { type: FeaturedSchema, default: {} },
    products: { type: [ProductSchema], default: [] },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
