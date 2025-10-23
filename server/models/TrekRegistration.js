import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required']
  },
  age: {
    type: Number,
    required: [true, 'Team member age is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Team member gender is required']
  },
  email: {
    type: String,
    required: [true, 'Team member email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Team member phone is required']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required']
  },
  healthInfo: {
    type: String
  }
});

const trekRegistrationSchema = new mongoose.Schema({
  trek: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trek',
    required: [true, 'Trek ID is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  teamMembers: {
    type: [teamMemberSchema],
    required: [true, 'At least one team member is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one team member is required'
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
trekRegistrationSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('teamMembers')) {
    try {
      const Trek = mongoose.model('Trek');
      const trek = await Trek.findById(this.trek);
      
      if (trek) {
        this.totalAmount = trek.price * this.teamMembers.length;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Add registration to user's registeredTreks after saving
trekRegistrationSchema.post('save', async function() {
  try {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(
      this.user,
      { $addToSet: { registeredTreks: this._id } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user registeredTreks:', error);
  }
});

const TrekRegistration = mongoose.model('TrekRegistration', trekRegistrationSchema);

export default TrekRegistration;