import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, 
  ChevronDown, ChevronUp, Check, X, ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { getTrekById } from '../services/trekService';
import { useAuth } from '../contexts/AuthContext';

const TrekDetailsPage = () => {
  const { id } = useParams();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        setLoading(true);
        const data = await getTrekById(id);
        setTrek(data);
      } catch (err) {
        setError('Failed to fetch trek details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrek();
  }, [id]);

  

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-error text-lg mb-4">{error || 'Trek not found'}</p>
        <Link to="/treks">
          <Button variant="primary">Back to Treks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img 
          src={trek.images[0]}
          alt={trek.title}
          className="w-full h-full object-cover border"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/treks" className="inline-flex items-center text-white hover:text-accent-300 mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to Treks
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`difficulty-badge-${trek.difficulty.toLowerCase()}`}>
                {trek.difficulty}
              </span>
              <span className="text-white text-sm px-2 py-0.5 bg-primary-500 rounded">
                {trek.duration} days
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{trek.title}</h1>
            <div className="flex items-center text-white">
              <MapPin size={16} className="mr-1" />
              <span>{trek.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trek Details */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              <button 
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview' 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'itinerary' 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('itinerary')}
              >
                Itinerary
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'included' 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('included')}
              >
                What's Included
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'reviews' 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trek Overview</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">{trek.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <span className="block text-sm text-gray-500">Duration</span>
                      <span className="font-semibold">{trek.duration} days</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <MapPin className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <span className="block text-sm text-gray-500">Location</span>
                      <span className="font-semibold">{trek.location}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Users className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <span className="block text-sm text-gray-500">Group Size</span>
                      <span className="font-semibold">Max {trek.maxGroupSize}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Calendar className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <span className="block text-sm text-gray-500">Next Date</span>
                      <span className="font-semibold">{formatDate(trek.startDates[0])}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {trek.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image}
                        alt={`${trek.title} - image ${index + 1}`}
                        className="rounded-lg w-full h-40 object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Trek Itinerary</h2>
                  <div className="space-y-4">
                    {trek.itinerary.map((day, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleAccordion(index)}
                        >
                          <div>
                            <span className="text-primary-500 font-medium">Day {day.day}: </span>
                            <span className="font-semibold">{day.title}</span>
                          </div>
                          {activeAccordion === index ? (
                            <ChevronUp size={18} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-500" />
                          )}
                        </button>
                        
                        {activeAccordion === index && (
                          <div className="p-4 border-t border-gray-200">
                            <p className="text-gray-700 mb-3">{day.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              {day.distance && (
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-1">Distance:</span> {day.distance}
                                </div>
                              )}
                              {day.elevation && (
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-1">Elevation:</span> {day.elevation}
                                </div>
                              )}
                              {day.accommodation && (
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-1">Accommodation:</span> {day.accommodation}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included Tab */}
              {activeTab === 'included' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                        <Check size={20} className="text-success mr-2" />
                        Included in the Price
                      </h3>
                      <ul className="space-y-3">
                        {trek.included.map((item, index) => (
                          <li key={index} className="flex">
                            <Check size={20} className="text-success flex-shrink-0 mr-2" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                        <X size={20} className="text-error mr-2" />
                        Not Included
                      </h3>
                      <ul className="space-y-3">
                        {trek.notIncluded.map((item, index) => (
                          <li key={index} className="flex">
                            <X size={20} className="text-error flex-shrink-0 mr-2" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    <div className="flex items-center">
                      <div className="flex items-center bg-primary-50 text-primary-600 px-3 py-1 rounded-full">
                        <span className="font-bold mr-1">{trek.averageRating}</span>
                        <span className="text-sm">/ 5</span>
                      </div>
                    </div>
                  </div>
                  
                  {trek.reviews && trek.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {trek.reviews.map((review, index) => (
                        <div 
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold">{review.user}</h3>
                            <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                          </div>
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet. Be the first to review this trek!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Book This Trek</h3>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700">Price per person</span>
                <span className="text-2xl font-bold text-primary-500">${trek.price}</span>
              </div>

              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <select
                  id="startDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a date</option>
                  {trek.startDates.map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              {isAuthenticated ? (
                <Link to={`/treks/${trek._id}/register${selectedDate ? `?date=${selectedDate}` : ''}`}>
                  <Button 
                    variant="primary" 
                    fullWidth
                    disabled={!selectedDate}
                    rightIcon={<ChevronRight size={20} />}
                  >
                    Register Team
                  </Button>
                </Link>
              ) : (
                <div>
                  <Link to="/login">
                    <Button 
                      variant="primary" 
                      fullWidth
                      className="mb-3"
                    >
                      Login to Book
                    </Button>
                  </Link>
                  <div className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-500 hover:underline">
                      Sign up here
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Trek Information:</h4>
                <ul className="space-y-2">
                  <li className="flex">
                    <Clock size={18} className="text-gray-500 flex-shrink-0 mr-2" />
                    <span className="text-gray-600">{trek.duration} days</span>
                  </li>
                  <li className="flex">
                    <Users size={18} className="text-gray-500 flex-shrink-0 mr-2" />
                    <span className="text-gray-600">Max {trek.maxGroupSize} people per group</span>
                  </li>
                  <li className="flex items-start">
                    <span className={`difficulty-badge-${trek.difficulty.toLowerCase()} flex-shrink-0 mt-1`}>
                      {trek.difficulty}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {trek.difficulty === 'Easy' && 'Suitable for beginners'}
                      {trek.difficulty === 'Moderate' && 'Some hiking experience recommended'}
                      {trek.difficulty === 'Challenging' && 'Previous trekking experience required'}
                      {trek.difficulty === 'Difficult' && 'Experienced trekkers only'}
                      {trek.difficulty === 'Extreme' && 'Advanced trekking skills essential'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekDetailsPage;