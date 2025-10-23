import express from 'express';
import TrekRegistration from '../models/TrekRegistration.js';
import Trek from '../models/Trek.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/trek-registrations
// @desc    Register for a trek
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { trek: trekId, startDate, teamMembers } = req.body;
    
    // Validate trek exists
    const trek = await Trek.findById(trekId);
    if (!trek) {
      return res.status(404).json({ message: 'Trek not found' });
    }
    
    // Create registration
    const registration = new TrekRegistration({
      trek: trekId,
      user: req.user._id,
      startDate,
      teamMembers,
      totalAmount: trek.price * teamMembers.length,
      paymentStatus: 'completed', // For demo purposes
    });
    
    const createdRegistration = await registration.save();
    
    // Populate trek details
    await createdRegistration.populate('trek');
    
    res.status(201).json(createdRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/trek-registrations/user
// @desc    Get all registrations for current user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const registrations = await TrekRegistration.find({ user: req.user._id })
      .populate('trek')
      .sort('-createdAt');
    
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/trek-registrations/:id
// @desc    Get registration by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const registration = await TrekRegistration.findById(req.params.id)
      .populate('trek');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if the registration belongs to the current user
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/trek-registrations/:id/cancel
// @desc    Cancel a registration
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const registration = await TrekRegistration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if the registration belongs to the current user
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update status
    registration.status = 'cancelled';
    const updatedRegistration = await registration.save();
    
    // Populate trek details
    await updatedRegistration.populate('trek');
    
    res.json(updatedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;