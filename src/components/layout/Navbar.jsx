import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClasses = `fixed w-full z-30 transition-all duration-300 ${
    isScrolled || isMenuOpen || location.pathname !== '/' 
      ? 'bg-white shadow-md py-2' 
      : 'bg-transparent py-4'
  }`;

  const linkClasses = `font-medium transition-colors duration-200 hover:text-primary-500 ${
    isScrolled || isMenuOpen || location.pathname !== '/' 
      ? 'text-gray-800' 
      : 'text-white hover:text-accent-300'
  }`;

  const activeClasses = `text-primary-500 ${
    isScrolled || isMenuOpen || location.pathname !== '/' 
      ? '' 
      : '!text-accent-500'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Mountain className={`w-8 h-8 mr-2 ${
              isScrolled || isMenuOpen || location.pathname !== '/' 
                ? 'text-primary-500' 
                : 'text-white'
            }`} />
            <span className={`text-xl font-display font-bold ${
              isScrolled || isMenuOpen || location.pathname !== '/' 
                ? 'text-primary-500' 
                : 'text-white'
            }`}>
              TrekAdventures
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/treks" 
              className={({ isActive }) => 
                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
              }
            >
              Treks
            </NavLink>
            <NavLink 
              to="/blogs" 
              className={({ isActive }) => 
                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
              }
            >
              Blog
            </NavLink>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    isActive ? `${linkClasses} ${activeClasses} flex items-center` : `${linkClasses} flex items-center`
                  }
                >
                  <UserCircle className="w-5 h-5 mr-1" />
                  {user?.name || 'Profile'}
                </NavLink>
                <button 
                  onClick={logout}
                  className={`px-3 py-1.5 rounded border transition-colors ${
                    isScrolled || location.pathname !== '/' 
                      ? 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-primary-500'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button 
                    className={`font-medium transition-colors ${
                      isScrolled || location.pathname !== '/' 
                        ? 'text-gray-800 hover:text-primary-500' 
                        : 'text-white hover:text-accent-300'
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button 
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      isScrolled || location.pathname !== '/' 
                        ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                        : 'bg-accent-500 hover:bg-accent-600 text-white'
                    }`}
                  >
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-800' 
                  : 'text-white'
              }`} />
            ) : (
              <Menu className={`w-6 h-6 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-800' 
                  : 'text-white'
              }`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? 'text-primary-500 font-medium' : 'text-gray-800 font-medium'
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/treks" 
                className={({ isActive }) => 
                  isActive ? 'text-primary-500 font-medium' : 'text-gray-800 font-medium'
                }
              >
                Treks
              </NavLink>
              <NavLink 
                to="/blogs" 
                className={({ isActive }) => 
                  isActive ? 'text-primary-500 font-medium' : 'text-gray-800 font-medium'
                }
              >
                Blog
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      isActive ? 'text-primary-500 font-medium flex items-center' : 'text-gray-800 font-medium flex items-center'
                    }
                  >
                    <UserCircle className="w-5 h-5 mr-1" />
                    {user?.name || 'Profile'}
                  </NavLink>
                  <button 
                    onClick={logout}
                    className="w-full py-2 border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="w-full">
                    <button className="w-full py-2 border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="w-full py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;