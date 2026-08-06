import { Router } from 'express';
import {
  listBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/blogs', listBlogs);
router.get('/blogs/:slug', getBlogBySlug);

// Admin routes (protected)
router.post('/admin/blogs', requireAdmin, createBlog);
router.put('/admin/blogs/:id', requireAdmin, updateBlog);
router.delete('/admin/blogs/:id', requireAdmin, deleteBlog);

export default router;
