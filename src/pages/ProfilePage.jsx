import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Trash2, Calendar, MapPin, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getUserRegistrations, cancelRegistration } from '../services/trekService';
import { updateUserProfile } from '../services/authService';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('registrations');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getUserRegistrations();
        setRegistrations(data);        
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load your trek registrations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);


  const handleCancelRegistration = async (registrationId) => {
    try {
      setCancelling(registrationId);
      await cancelRegistration(registrationId);
      
      // Update the local state
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg._id === registrationId 
            ? { ...reg, status: 'cancelled' } 
            : reg
        )
      );
    } catch (err) {
      console.error('Failed to cancel registration:', err);
      setError('Failed to cancel registration. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError('');

    // Validate passwords if attempting to change
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setUpdateError('Current password is required to set a new password');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setUpdateError('New passwords do not match');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setUpdateError('New password must be at least 6 characters');
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
      };
      
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await updateUserProfile(updateData);
      setUpdateSuccess(true);
      setEditMode(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Profile update error:', err);
      setUpdateError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    }
  };

  // Format date for display
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
      transition: { duration: 0.5 }
    }
  };

  if (authLoading) {
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
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-lg md:text-xl max-w-3xl">
            Manage your account details and trek registrations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'registrations' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('registrations')}
            >
              My Registrations
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'account' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Registrations Tab */}
            {activeTab === 'registrations' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">My Trek Registrations</h2>
                  <Link to="/treks">
                    <Button variant="outline" className="border-primary-500 text-primary-500">
                      Browse Treks
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      <button 
                        className="text-red-700 underline mt-1"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Registrations Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't registered for any treks yet.</p>
                    <Link to="/treks">
                      <Button variant="primary">
                        Explore Available Treks
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {registrations.map((registration) => {
                      const trek = registration.trek;
                      const isCancelled = registration.status === 'cancelled';
                      const isCompleted = registration.status === 'completed';

                      if (!trek) {
                        return (
                          <div key={registration._id} className="border rounded-lg overflow-hidden border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                            <div className="mb-2 font-bold">Trek information unavailable</div>
                            <div className="text-sm">This trek may have been deleted by the admin.</div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={registration._id}
                          className={`border rounded-lg overflow-hidden ${
                            isCancelled ? 'border-gray-200 opacity-75' : 'border-gray-200'
                          }`}
                        >
                          <div className="md:flex">
                            <div className="md:w-1/3 relative">
                              <img 
                                src={trek.images[0]}
                                alt={trek.title}
                                className={`h-48 w-full object-cover border ${isCancelled ? 'filter grayscale' : ''}`}
                              />
                              {isCancelled && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Cancelled
                                </div>
                              )}
                              {isCompleted && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Completed
                                </div>
                              )}
                            </div>
                            <div className="p-4 md:p-6 md:w-2/3">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`difficulty-badge-${trek.difficulty.toLowerCase()}`}>{trek.difficulty}</span>
                                <span className="flex items-center text-xs text-gray-500">
                                  <Calendar size={14} className="mr-1" />
                                  {formatDate(registration.startDate)}
                                </span>
                                <span className="flex items-center text-xs text-gray-500">
                                  <Clock size={14} className="mr-1" />
                                  {trek.duration} days
                                </span>
                              </div>
                              <h3 className="text-xl font-bold mb-1">{trek.title}</h3>
                              <p className="flex items-center text-gray-600 mb-4">
                                <MapPin size={16} className="mr-1" />
                                {trek.location}
                              </p>
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Team Members ({registration.teamMembers.length})</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {registration.teamMembers.map((member, idx) => (
                                    <li key={idx}>{member.name}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex flex-wrap justify-between items-center">
                                <div>
                                  <span className="text-gray-500 text-sm">Total Amount</span>
                                  <p className="font-bold text-primary-500">${registration.totalAmount}</p>
                                </div>
                                {!isCancelled && !isCompleted && (
                                  <div className="flex space-x-2 mt-2 md:mt-0">
                                    <Link to={`/treks/${trek._id}`}>
                                      <Button variant="outline" size="sm" className="border-primary-500 text-primary-500">
                                        View Trek
                                      </Button>
                                    </Link>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                      onClick={() => handleCancelRegistration(registration._id)}
                                      isLoading={cancelling === registration._id}
                                      leftIcon={cancelling === registration._id ? null : <Trash2 size={16} />}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Account Settings</h2>
                  {!editMode && (
                    <Button 
                      variant="outline" 
                      className="border-primary-500 text-primary-500"
                      leftIcon={<Edit size={16} />}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                {updateSuccess && (
                  <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-start">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                    <span>Your profile has been updated successfully!</span>
                  </div>
                )}

                {updateError && (
                  <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                    <span>{updateError}</span>
                  </div>
                )}

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                        Email (Cannot be changed)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="font-medium text-gray-700 mb-3">Change Password (Optional)</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-1">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditMode(false);
                          setUpdateError('');
                          // Reset form to original values
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              email: user.email || '',
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            });
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        variant="primary"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="block text-sm text-gray-500">Full Name</span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="block text-sm text-gray-500">Email</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="block text-sm text-gray-500">Account Created</span>
                      <span className="font-medium">
                        {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ className, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default ProfilePage;