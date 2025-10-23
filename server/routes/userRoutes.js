import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TrekRegistration from '../models/TrekRegistration.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sendVerificationEmail, sendProfileUpdateEmail } from '../utils/emailService.js';

const router = express.Router();



// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  console.log("reached here!!!!");
  
  try {
    const user = await User.findById(req.user._id).select('-password -verificationCode -verificationCodeExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but not verified, allow re-registration
      if (!userExists.isVerified) {
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        userExists.name = name;
        userExists.password = password; // Will be hashed by pre-save middleware
        userExists.verificationCode = verificationCode;
        userExists.verificationCodeExpires = verificationCodeExpires;
        await userExists.save();

        // Send new verification email
        await sendVerificationEmail(email, verificationCode);
        
        return res.status(200).json({
          message: 'Verification code resent. Please check your email.',
          email
        });
      }
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);
    
    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/verify
// @desc    Verify user email
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({ 
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    }).select('+verificationCode +verificationCodeExpires');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/request-profile-update
// @desc    Request profile update verification
// @access  Private
router.post('/request-profile-update', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendProfileUpdateEmail(user.email, verificationCode);

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, currentPassword, newPassword, verificationCode } = req.body;
    
    const user = await User.findById(req.user._id).select('+verificationCode +verificationCodeExpires');
    
    // Verify code if updating sensitive information
    if (newPassword) {
      if (!verificationCode || verificationCode !== user.verificationCode || user.verificationCodeExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }
    }

    // Update fields
    if (name) user.name = name;
    
    // If updating password
    if (newPassword) {
      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      user.password = newPassword;
    }

    // Clear verification data
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/admin/registrations
// @desc    Get all trek registrations (admin only)
// @access  Private/Admin
router.get('/allregistrations', protect, admin, async (req, res) => {
  try {
    // Return all trek registrations with trek and user info
    const registrations = await TrekRegistration.find({})
      .populate('trek', 'title location startDate')
      .populate('user', 'name email')
      .sort('-createdAt');

    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;