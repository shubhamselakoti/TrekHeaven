import mongoose from 'mongoose';

const trekSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A trek must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A trek must have a description']
  },
  location: {
    type: String,
    required: [true, 'A trek must have a location']
  },
  duration: {
    type: Number,
    required: [true, 'A trek must have a duration']
  },
  difficulty: {
    type: String,
    required: [true, 'A trek must have a difficulty level'],
    enum: {
      values: ['Easy', 'Moderate', 'Challenging', 'Difficult', 'Extreme'],
      message: 'Difficulty must be either: Easy, Moderate, Challenging, Difficult, or Extreme'
    }
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A trek must have a maximum group size']
  },
  price: {
    type: Number,
    required: [true, 'A trek must have a price']
  },
  images: {
    type: [String],
    required: [true, 'A trek must have at least one image']
  },
  startDates: {
    type: [Date],
    required: [true, 'A trek must have at least one start date']
  },
  included: {
    type: [String],
    default: []
  },
  notIncluded: {
    type: [String],
    default: []
  },
  itinerary: [
    {
      day: Number,
      title: String,
      description: String,
      distance: String,
      elevation: String,
      accommodation: String
    }
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for registrations
trekSchema.virtual('registrations', {
  ref: 'TrekRegistration',
  localField: '_id',
  foreignField: 'trek'
});

// Calculate average rating middleware
trekSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  }
  next();
});

const Trek = mongoose.model('Trek', trekSchema);

export default Trek;