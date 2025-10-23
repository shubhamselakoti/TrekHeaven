// Deprecated component - no longer used, replaced by TrekRegistrationsAdmin in AdminDashboard

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, UserPlus, Shield, ShieldOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';
import apiClient from '../../services/apiClient';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleUserAdmin = async (userId, isAdmin) => {
    try {
      await apiClient.put(`/users/${userId}/role`, { isAdmin: !isAdmin });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: !isAdmin } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === '' || 
      (filters.role === 'admin' ? user.isAdmin : !user.isAdmin);
    const matchesSearch = filters.searchTerm === '' || 
      user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
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

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isAdmin 
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isAdmin ? 'Administrator' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserAdmin(user._id, user.isAdmin)}
                      leftIcon={user.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                      className={user.isAdmin ? 'text-red-500 border-red-500' : 'text-primary-500 border-primary-500'}
                    >
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;