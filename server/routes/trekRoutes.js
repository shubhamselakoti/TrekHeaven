import express from 'express';
import Trek from '../models/Trek.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/treks
// @desc    Get all treks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const treks = await Trek.find({});
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/treks/:id
// @desc    Get trek by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    res.json(trek);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/treks
// @desc    Create a new trek
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const trek = new Trek(req.body);
    const createdTrek = await trek.save();
    res.status(201).json(createdTrek);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/treks/:id
// @desc    Update a trek
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      trek[key] = req.body[key];
    });
    
    const updatedTrek = await trek.save();
    res.json(updatedTrek);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/treks/:id
// @desc    Partially update a trek
// @access  Private/Admin
router.patch('/:id', protect, admin, async (req, res) => {
  console.log('Patch request received for trek ID:', req.params.id);
  try {
    const trek = await Trek.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    res.json(trek);
  } catch (error) {
    console.error('Error patching trek:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/treks/:id
// @desc    Delete a trek
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    // Optionally: Remove related registrations, images, etc. here if needed
    await trek.deleteOne(); // Use deleteOne for clarity and compatibility
    res.json({ message: 'Trek removed' });
  } catch (error) {
    console.error('Error deleting trek:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/treks/:id/reviews
// @desc    Create a new review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    
    // Check if user already reviewed
    const alreadyReviewed = trek.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Trek already reviewed' });
    }
    
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };
    
    trek.reviews.push(review);
    await trek.save();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;