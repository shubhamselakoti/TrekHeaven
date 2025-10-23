import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Search, Filter, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { getAllTreks, deleteTrek } from '../../services/trekService';

const TreksList = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    location: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const data = await getAllTreks();
        setTreks(data);
      } catch (err) {
        setError('Failed to fetch treks');
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTreks = treks.filter(trek => {
    const matchesDifficulty = !filters.difficulty || trek.difficulty === filters.difficulty;
    const matchesLocation = !filters.location || 
      trek.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      trek.title.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDifficulty && matchesLocation && matchesSearch;
  });

  const handleDeleteTrek = async (trekId) => {
    if (!window.confirm('Are you sure you want to delete this trek?')) return;
    try {
      await deleteTrek(trekId);
      setTreks(prev => prev.filter(trek => trek._id !== trekId));
    } catch (err) {
      setError('Failed to delete trek');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Treks Management</h1>
        <Link to="/admin/treks/new">
          <Button variant="primary">Add New Trek</Button>
        </Link>
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
              placeholder="Search treks..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Filter by location..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Treks Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTreks.map((trek) => (
                <tr key={trek._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={trek.images[0]} 
                        alt={trek.title}
                        className="h-10 w-10 rounded-md object-cover border"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{trek.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trek.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trek.duration} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`difficulty-badge-${trek.difficulty.toLowerCase()}`}>
                      {trek.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${trek.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                    <div className="flex justify-end items-center gap-2">
                      <Link 
                        to={`/admin/treks/${trek._id}/edit`}
                        className="text-primary-500 hover:text-primary-600"
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteTrek(trek._id)}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default TreksList;