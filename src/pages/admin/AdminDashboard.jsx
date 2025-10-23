import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Mountain, List, PlusCircle, Users, LogOut } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';
import TreksList from './TreksList';
import TrekRegistrationsAdmin from './TrekRegistrationsAdmin';
import TrekForm from './TrekForm';
import BlogsList from './BlogsList';
import BlogForm from './BlogForm';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center">
            <Mountain className="w-8 h-8 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-gray-800">Admin Portal</span>
          </div>
        </div>
        <nav className="mt-6">
          <Link to="/admin/treks">
            <div className="px-6 py-3 flex items-center text-gray-700 hover:bg-gray-100">
              <List className="w-5 h-5 mr-3" />
              Treks List
            </div>
          </Link>
          <Link to="/admin/treks/new">
            <div className="px-6 py-3 flex items-center text-gray-700 hover:bg-gray-100">
              <PlusCircle className="w-5 h-5 mr-3" />
              Add New Trek
            </div>
          </Link>
          <Link to="/admin/registrations">
            <div className="px-6 py-3 flex items-center text-gray-700 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-3" />
              Trek Registrations
            </div>
          </Link>
          <Link to="/admin/blogs">
            <div className="px-6 py-3 flex items-center text-gray-700 hover:bg-gray-100">
              <PlusCircle className="w-5 h-5 mr-3" />
              Blogs
            </div>
          </Link>
          <Link to="/admin/blogs/new">
            <div className="px-6 py-3 flex items-center text-gray-700 hover:bg-gray-100">
              <PlusCircle className="w-5 h-5 mr-3" />
              Add New Blog
            </div>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button
            variant="outline"
            fullWidth
            className="border-red-500 text-red-500 hover:bg-red-50"
            leftIcon={<LogOut size={18} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<TreksList />} />
          <Route path="/treks" element={<TreksList />} />
          <Route path="/treks/new" element={<TrekForm />} />
          <Route path="/treks/:id/edit" element={<TrekForm />} />
          <Route path="/registrations" element={<TrekRegistrationsAdmin />} />
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blogs/new" element={<BlogForm />} />
          <Route path="/blogs/:id/edit" element={<BlogForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;