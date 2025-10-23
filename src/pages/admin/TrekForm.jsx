import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { getTrekById, updateTrek, createTrek } from '../../services/trekService';

const TrekForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    difficulty: '',
    maxGroupSize: '',
    price: '',
    images: [''],
    startDates: [''],
    included: [''],
    notIncluded: [''],
    itinerary: [
      {
        day: 1,
        title: '',
        description: '',
        distance: '',
        elevation: '',
        accommodation: ''
      }
    ]
  });

  // Remove all upload logic, only allow URLs
  const [imageUrls, setImageUrls] = useState([]); // All image URLs (existing + new)

  // On fetch, set imageUrls from formData.images
  useEffect(() => {
    if (formData.images && Array.isArray(formData.images)) {
      setImageUrls(formData.images.filter(img => typeof img === 'string' && img));
    }
  }, [formData.images]);

  useEffect(() => {
    if (id) {
      const fetchTrek = async () => {
        try {
          const data = await getTrekById(id);
          setFormData(data);
        } catch (err) {
          setError('Failed to fetch trek details');
        } finally {
          setLoading(false);
        }
      };

      fetchTrek();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: '',
          description: '',
          distance: '',
          elevation: '',
          accommodation: ''
        }
      ]
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  // Remove image by index
  const handleDeleteImage = (idx) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  // Add image URL
  const handleAddImageUrl = (url) => {
    if (url && typeof url === 'string') {
      setImageUrls(prev => [...prev, url]);
    }
  };

  // On submit, save imageUrls to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const trekData = { ...formData, images: imageUrls };
      if (id) {
        await updateTrek(id, trekData);
        navigate(-1);
      } else {
        await createTrek(trekData);
        navigate(-1);
      }
    } catch (err) {
      setError('Failed to save trek');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/treks')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? 'Edit Trek' : 'Add New Trek'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Difficult">Difficult</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Group Size
            </label>
            <input
              type="number"
              name="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min="0"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (enter image URLs)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Paste image URL and press Add"
              className="flex-1 p-2 border rounded"
              id="add-image-url"
            />
            <Button type="button" onClick={() => {
              const input = document.getElementById('add-image-url');
              if (input && input.value) {
                handleAddImageUrl(input.value);
                input.value = '';
              }
            }}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {imageUrls.map((src, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-32 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(idx)}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">Paste direct image URLs. Remove any before saving.</p>
        </div>

        {/* Start Dates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Dates
          </label>
          {formData.startDates.map((date, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="date"
                value={date}
                onChange={(e) => handleArrayChange(index, 'startDates', e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => removeArrayField('startDates', index)}
                className="ml-2 text-red-500 hover:text-red-600"
                disabled={formData.startDates.length === 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('startDates')}
            leftIcon={<Plus size={16} />}
          >
            Add Date
          </Button>
        </div>

        {/* Included Items */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Included Items
          </label>
          {formData.included.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, 'included', e.target.value)}
                placeholder="Included item"
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => removeArrayField('included', index)}
                className="ml-2 text-red-500 hover:text-red-600"
                disabled={formData.included.length === 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('included')}
            leftIcon={<Plus size={16} />}
          >
            Add Item
          </Button>
        </div>

        {/* Not Included Items */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Not Included Items
          </label>
          {formData.notIncluded.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, 'notIncluded', e.target.value)}
                placeholder="Not included item"
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => removeArrayField('notIncluded', index)}
                className="ml-2 text-red-500 hover:text-red-600"
                disabled={formData.notIncluded.length === 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('notIncluded')}
            leftIcon={<Plus size={16} />}
          >
            Add Item
          </Button>
        </div>

        {/* Itinerary */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Itinerary
          </label>
          {formData.itinerary.map((day, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Day {day.day}</h3>
                <button
                  type="button"
                  onClick={() => removeItineraryDay(index)}
                  className="text-red-500 hover:text-red-600"
                  disabled={formData.itinerary.length === 1}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={day.accommodation}
                    onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={day.description}
                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance
                  </label>
                  <input
                    type="text"
                    value={day.distance}
                    onChange={(e) => handleItineraryChange(index, 'distance', e.target.value)}
                    placeholder="e.g. 10km"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Elevation
                  </label>
                  <input
                    type="text"
                    value={day.elevation}
                    onChange={(e) => handleItineraryChange(index, 'elevation', e.target.value)}
                    placeholder="e.g. +500m"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItineraryDay}
            leftIcon={<Plus size={16} />}
          >
            Add Day
          </Button>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/treks')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {id ? 'Update Trek' : 'Create Trek'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrekForm;