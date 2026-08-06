import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: String, default: 'ZarkoWear Admin' },
  tags: [{ type: String }],
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
