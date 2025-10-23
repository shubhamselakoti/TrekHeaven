import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Search, Filter, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { getAllBlogs } from '../services/blogService';
import { motion } from 'framer-motion';

const BlogsListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
        setDisplayedBlogs(data.slice(0, blogsPerPage));
      } catch (err) {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  
  // Filter and sort blogs
  useEffect(() => {
    let filteredBlogs = [...blogs];

    // Apply search filter
    if (searchTerm) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'views') {
      filteredBlogs.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'title') {
      filteredBlogs.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Reset pagination when filters change
    setCurrentPage(1);
    setDisplayedBlogs(filteredBlogs.slice(0, blogsPerPage));
  }, [blogs, searchTerm, sortBy]);

  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * blogsPerPage;
    const endIndex = nextPage * blogsPerPage;
    
    let filteredBlogs = [...blogs];
    
    if (searchTerm) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy === 'date') {
      filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'views') {
      filteredBlogs.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'title') {
      filteredBlogs.sort((a, b) => a.title.localeCompare(b.title));
    }

    const newBlogs = filteredBlogs.slice(startIndex, endIndex);
    setDisplayedBlogs([...displayedBlogs, ...newBlogs]);
    setCurrentPage(nextPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-primary-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Adventure Blog</h1>
          <p className="text-lg md:text-xl max-w-3xl">
            Discover stories, tips, and insights from fellow adventurers and trekking experts.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-primary-500 transition-colors"
            >
              <Filter size={18} className="mr-1" />
              Sort & Filter
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="date">Latest First</option>
                    <option value="views">Most Viewed</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blogs List */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {error ? (
          <div className="text-center py-12">
            <p className="text-error text-lg">{error}</p>
            <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : displayedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blogs found matching your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-primary-500 text-primary-500" 
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {displayedBlogs.map((blog) => (
                <motion.div 
                  key={blog._id}
                  variants={fadeIn}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={blog.images[0]} 
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-500 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {blog.author.name}
                      </div>
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {blog.views}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(blog.createdAt)}
                    </div>
                    
                    <Link to={`/blog/${blog.slug}`} className="mt-4 block">
                      <Button variant="outline" size="sm" className="w-full border-primary-500 text-primary-500">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Show More Button */}
            {(() => {
              let filteredBlogs = [...blogs];
              
              if (searchTerm) {
                filteredBlogs = filteredBlogs.filter(blog =>
                  blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                );
              }

              return displayedBlogs.length < filteredBlogs.length && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    onClick={handleShowMore}
                    className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                  >
                    Show More Blogs
                  </Button>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsListPage;