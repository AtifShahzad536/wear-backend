import { Blog } from '../models/Blog.js';

// Helper to generate slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// List & Search Blogs
export const listBlogs = async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      const cleanQ = String(q).trim();
      query = {
        $or: [
          { title: { $regex: cleanQ, $options: 'i' } },
          { content: { $regex: cleanQ, $options: 'i' } },
          { excerpt: { $regex: cleanQ, $options: 'i' } },
          { tags: { $in: [new RegExp(cleanQ, 'i')] } }
        ]
      };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: err.message });
  }
};

// Get Blog by Slug (SEO friendly)
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug: slug.toLowerCase().trim() }).lean();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog details', details: err.message });
  }
};

// Admin: Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, coverImage, author, tags } = req.body;
    
    if (!title || !content || !excerpt) {
      return res.status(400).json({ error: 'Title, content, and excerpt are required' });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);
    
    // Ensure slug uniqueness
    let existing = await Blog.findOne({ slug: finalSlug }).lean();
    let counter = 1;
    while (existing) {
      finalSlug = `${slugify(slug || title)}-${counter}`;
      existing = await Blog.findOne({ slug: finalSlug }).lean();
      counter++;
    }

    const newBlog = await Blog.create({
      title,
      slug: finalSlug,
      content,
      excerpt,
      coverImage: coverImage || '',
      author: author || 'ZarkoWear Admin',
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : [])
    });

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog post', details: err.message });
  }
};

// Admin: Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, coverImage, author, tags } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Prepare updates
    const updates = { updatedAt: Date.now() };
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (excerpt) updates.excerpt = excerpt;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (author) updates.author = author;
    if (tags) {
      updates.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim());
    }

    if (slug) {
      let finalSlug = slugify(slug);
      if (finalSlug !== blog.slug) {
        // Ensure new slug is unique
        let existing = await Blog.findOne({ slug: finalSlug, _id: { $ne: id } }).lean();
        let counter = 1;
        while (existing) {
          finalSlug = `${slugify(slug)}-${counter}`;
          existing = await Blog.findOne({ slug: finalSlug, _id: { $ne: id } }).lean();
          counter++;
        }
        updates.slug = finalSlug;
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog post', details: err.message });
  }
};

// Admin: Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog post deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog post', details: err.message });
  }
};
