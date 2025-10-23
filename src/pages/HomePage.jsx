import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mountain, Map, Users, Calendar, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAllTreks } from '../services/trekService';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  useEffect(() => {
    const fetchFeaturedTreks = async () => {
      try {
        setLoadingFeatured(true);
        const data = await getAllTreks();
        
        setFeaturedTreks(data.slice(0, 3));
      } catch (err) {
        setErrorFeatured('Failed to fetch featured treks.');
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedTreks();
  }, []);

  // const testimonials = [
  //   {
  //     id: 1,
  //     name: 'Sarah Johnson',
  //     trek: 'Himalayan Adventure',
  //     text: 'One of the most incredible experiences of my life. The guides were knowledgeable and the views were breathtaking. Highly recommend!',
  //     image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  //   },
  //   {
  //     id: 2,
  //     name: 'Michael Chen',
  //     trek: 'Alpine Expedition',
  //     text: 'Everything was perfectly organized from start to finish. The team made sure we were safe while still having an amazing adventure.',
  //     image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  //   },
  //   {
  //     id: 3,
  //     name: 'Emma Rodriguez',
  //     trek: 'Rainforest Discovery',
  //     text: 'The biodiversity we saw was incredible! Our guide knew everything about the local flora and fauna. An unforgettable journey!',
  //     image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  //   }
  // ];

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
        staggerChildren: 0.2
      }
    }
  };

  // Helper to get correct image URL for dev/prod
  const getImageUrl = (src) => {
    if (!src) return '';
    if (Array.isArray(src)) src = src[0];
    if (!src) return '';
    if (src.startsWith('http')) return src;
    if (import.meta.env.DEV) {
      return `http://localhost:5000${src}`;
    }
    return src;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="h-screen bg-hero-pattern bg-cover bg-center relative flex items-center">
        <div className="container mx-auto px-4 z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-1.5xl lg:text-3xl font-bold text-white mb-4">
              Where the clouds kiss the mountains and your journey begins.
              Sacred paths through the Himalayas
              Walk. Breathe. Awaken.
            </h1>
            <p className="text-xl text-white mb-8">
              Join our guided treks to explore some of the most breathtaking landscapes around the globe. Adventure awaits!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/treks">
                <Button 
                  variant="accent" 
                  size="lg"
                  rightIcon={<ChevronRight size={20} />}
                >
                  Explore Treks
                </Button>
              </Link>
              {isAuthenticated ? (null) : (
                <Link to="/register">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-500"
                >
                  Sign Up Today
                </Button>
              </Link>
              )}
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trek With Us?</h2>
            <p className="text-lg text-gray-600">
              We provide unforgettable adventures with experienced guides, ensuring safety and memorable experiences.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-500 mb-4">
                <Mountain size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">Experienced guides with intimate knowledge of all routes and terrain.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-500 mb-4">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Routes</h3>
              <p className="text-gray-600">Carefully crafted itineraries to showcase the best landscapes and viewpoints.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-500 mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Small Groups</h3>
              <p className="text-gray-600">Trek in intimate groups for a more personalized and enjoyable experience.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">Comprehensive safety protocols and equipment for worry-free adventures.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Treks Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Treks</h2>
            <p className="text-lg text-gray-600">
              Discover our most popular adventures, from mountain peaks to lush forests
            </p>
          </motion.div>

          {loadingFeatured ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">Loading featured treks...</p>
            </div>
          ) : errorFeatured ? (
            <div className="text-center py-8">
              <p className="text-lg text-red-500">{errorFeatured}</p>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredTreks.map((trek) => (
                <motion.div 
                  key={trek.id}
                  variants={fadeIn}
                  className="trek-card group"
                >
                  <div className="relative h-60 md:h-72 overflow-hidden rounded-t-lg">
                    <img 
                      src={trek.images[0]} 
                      alt={trek.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-500 mr-1" />
                        <span className="text-gray-600">{trek.duration} days</span>
                      </div>
                      <p className="font-bold text-primary-500">${trek.price}</p>
                    </div>
                    <Link to={`/treks/${trek.id}`}>
                      <Button variant="primary" fullWidth>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link to="/treks">
              <Button 
                variant="outline" 
                className="border-primary-500 text-primary-500"
                rightIcon={<ChevronRight size={20} />}
              >
                View All Treks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Trekkers Say</h2>
            <p className="text-lg text-gray-600">
              Hear from adventurers who have experienced our treks firsthand
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.trek}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8">
              Join IndiaTrekHeaven today and embark on the journey of a lifetime!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ?(null) : (
                <Link to="/register">
                  <Button 
                    variant="accent" 
                    size="lg"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              )} 
              
              <Link to="/treks">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-500"
                >
                  Browse Treks
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;