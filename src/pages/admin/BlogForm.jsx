import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getBlogById, createBlog, updateBlog } from '../../services/blogService';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    images: [''],
    tags: ['']
  });

  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const data = await getBlogById(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            content: data.content || '',
            images: data.images && data.images.length > 0 ? data.images : [''],
            tags: data.tags && data.tags.length > 0 ? data.tags : ['']
          });
        } catch (err) {
          setError('Failed to fetch blog details. Please try again.');
          console.error('Fetch blog error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
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

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!formData.images.some(img => img.trim())) {
      setError('At least one image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Clean up empty fields
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (isEditing) {
        await updateBlog(id, cleanedData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1500);
      } else {
        await createBlog(cleanedData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} blog. Please try again.`);
      console.error('Save blog error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
          <span className="mr-2">✅</span>
          Blog {isEditing ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description of the blog post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write your blog content here. You can use markdown formatting."
            />
            <p className="mt-1 text-sm text-gray-500">
              Tip: You can use markdown formatting (## for headings, **bold**, *italic*, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images *
            </label>
            {formData.images.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleArrayChange(index, 'images', e.target.value)}
                  placeholder="Image URL (e.g., https://example.com/image.jpg)"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('images', index)}
                  className="ml-2 text-red-500 hover:text-red-600 p-1 rounded transition-colors"
                  disabled={formData.images.length === 1}
                  title="Remove image"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayField('images')}
              leftIcon={<Plus size={16} />}
            >
              Add Image
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange(index, 'tags', e.target.value)}
                  placeholder="Add a tag (e.g., Adventure, Trekking)"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('tags', index)}
                  className="ml-2 text-red-500 hover:text-red-600 p-1 rounded transition-colors"
                  disabled={formData.tags.length === 1}
                  title="Remove tag"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayField('tags')}
              leftIcon={<Plus size={16} />}
            >
              Add Tag
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blogs')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            isLoading={saving}
            leftIcon={!saving ? <Save size={16} /> : null}
          >
            {saving ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Blog' : 'Create Blog')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;