import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-500 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Mountain className="w-8 h-8 mr-2 text-accent-500" />
              <span className="text-xl font-display font-bold">IndiaTrekHeaven</span>
            </div>
            <p className="text-gray-200 mb-4">
              Join us on an adventure of a lifetime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary-400 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-200 hover:text-accent-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/treks" className="text-gray-200 hover:text-accent-500 transition-colors">Treks</Link>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Testimonials</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Popular Treks */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary-400 pb-2">Popular Treks</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Himalayan Adventure</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Alpine Expedition</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Rainforest Discovery</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Desert Explorer</a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-accent-500 transition-colors">Coastal Trek</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-secondary-400 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              {/* <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">123 Adventure Street, Trekville, TR 54321</span>
              </li> */}
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-accent-500" />
                <span className="text-gray-200">+91 62835 16223</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-accent-500" />
                <span className="text-gray-200">indiantrekheaven@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-400 mt-8 pt-6 text-sm text-gray-300 text-center">
          <p>&copy; {new Date().getFullYear()} IndiaTrekHeaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;