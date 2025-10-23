import express from 'express';
import Blog from '../models/Blog.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author', 'name')
      .sort('-createdAt');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get related blogs based on tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      tags: { $in: blog.tags }
    })
    .limit(3)
    .select('title slug images createdAt');

    res.json({ blog, relatedBlogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/id/:id
// @desc    Get blog by ID (for admin editing)
// @access  Private/Admin
router.get('/id/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user._id
    });
    const createdBlog = await blog.save();
    await createdBlog.populate('author', 'name');
    res.status(201).json(createdBlog);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (title already exists)
      res.status(400).json({ message: 'A blog with this title already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'author' && key !== 'createdAt') {
        blog[key] = req.body[key];
      }
    });
    
    blog.updatedAt = new Date();
    
    const updatedBlog = await blog.save();
    await updatedBlog.populate('author', 'name');
    res.json(updatedBlog);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (title already exists)
      res.status(400).json({ message: 'A blog with this title already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private/Admin



router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;