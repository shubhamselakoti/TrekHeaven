import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Map, Calendar, Filter, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { getAllTreks } from '../services/trekService';

const TreksPage = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    duration: '',
    location: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const data = await getAllTreks();
        setTreks(data);
      } catch (err) {
        setError('Failed to fetch treks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  // Sample data for development

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Already updating the filters as typing occurs
  };

  const filteredTreks = treks.filter((trek) => {
    const matchesDifficulty = filters.difficulty === '' || trek.difficulty === filters.difficulty;
    const matchesDuration = filters.duration === '' || 
      (filters.duration === 'short' && trek.duration <= 7) ||
      (filters.duration === 'medium' && trek.duration > 7 && trek.duration <= 14) ||
      (filters.duration === 'long' && trek.duration > 14);
    const matchesLocation = filters.location === '' || trek.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = filters.searchTerm === '' || 
      trek.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      trek.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDifficulty && matchesDuration && matchesLocation && matchesSearch;
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-primary-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Treks</h1>
          <p className="text-lg md:text-xl max-w-3xl">
            Discover a world of adventure with our curated selection of treks across diverse landscapes and difficulty levels.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search treks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </form>
            
            <button 
              onClick={toggleFilters}
              className="flex items-center text-gray-700 hover:text-primary-500 transition-colors"
            >
              <Filter size={18} className="mr-1" />
              Filters
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Durations</option>
                  <option value="short">Short (1-7 days)</option>
                  <option value="medium">Medium (8-14 days)</option>
                  <option value="long">Long (15+ days)</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. Nepal, Switzerland"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Treks List */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-error text-lg">{error}</p>
            <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : filteredTreks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No treks match your filters. Try adjusting your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-primary-500 text-primary-500" 
              onClick={() => setFilters({
                difficulty: '',
                duration: '',
                location: '',
                searchTerm: '',
              })}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredTreks.map((trek) => (
              <motion.div 
                key={trek._id}
                variants={fadeIn}
                className="trek-card group"
              >
                <div className="relative h-60 md:h-72 overflow-hidden rounded-t-lg">
                  <img 
                    src={trek.images[0]}
                    alt={trek.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 border"
                  />
                  <div className="absolute inset-0 bg-trek-card-gradient"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className={`difficulty-badge-${trek.difficulty.toLowerCase()}`}>
                      {trek.difficulty}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{trek.title}</h3>
                    <p className="flex items-center mt-1">
                      <Map size={16} className="mr-1" />
                      {trek.location}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-b-lg">
                  <p className="text-gray-700 mb-4 line-clamp-2">{trek.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-600">{trek.duration} days</span>
                    </div>
                    <p className="font-bold text-primary-500">${trek.price}</p>
                  </div>
                  <Link to={`/treks/${trek._id}`}>
                    <Button variant="primary" fullWidth>
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TreksPage;