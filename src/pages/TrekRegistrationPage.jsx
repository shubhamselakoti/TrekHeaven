import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { getTrekById, registerForTrek } from '../services/trekService';
import { motion } from 'framer-motion';

const TrekRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('date');

  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      emergencyContact: '',
      healthInfo: ''
    }
  ]);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const data = await getTrekById(id);
        setTrek(data);
      } catch (err) {
        setError('Failed to fetch trek details');
      } finally {
        setLoading(false);
      }
    };

    fetchTrek();
  }, [id]);

  const handleAddMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        name: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        emergencyContact: '',
        healthInfo: ''
      }
    ]);
  };

  const handleRemoveMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate team size
      if (teamMembers.length > trek.maxGroupSize) {
        throw new Error(`Maximum team size is ${trek.maxGroupSize} members`);
      }

      // Validate all required fields
      const hasEmptyFields = teamMembers.some(member => 
        !member.name || !member.age || !member.gender || 
        !member.email || !member.phone || !member.emergencyContact
      );

      if (hasEmptyFields) {
        throw new Error('Please fill in all required fields for each team member');
      }

      const registration = await registerForTrek(id, startDate, teamMembers);
      navigate(`/profile`, { 
        state: { registrationSuccess: true, registrationId: registration._id } 
      });
    } catch (err) {
      setError(err.message || 'Failed to register team. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-error text-lg mb-4">Trek not found</p>
        <Link to="/treks">
          <Button variant="primary">Back to Treks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-primary-500 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            to={`/treks/${id}`}
            className="inline-flex items-center text-white hover:text-accent-300 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Trek Details
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Team Registration</h1>
          <p className="text-xl">{trek.title}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Trek Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500">Start Date</span>
                <span className="font-medium">{new Date(startDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div>
                <span className="block text-gray-500">Duration</span>
                <span className="font-medium">{trek.duration} days</span>
              </div>
              <div>
                <span className="block text-gray-500">Price per Person</span>
                <span className="font-medium">${trek.price}</span>
              </div>
              <div>
                <span className="block text-gray-500">Maximum Group Size</span>
                <span className="font-medium">{trek.maxGroupSize} people</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Team Member {index + 1}</h3>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                        required
                        min="18"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact *
                      </label>
                      <input
                        type="tel"
                        value={member.emergencyContact}
                        onChange={(e) => handleMemberChange(index, 'emergencyContact', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Health Information
                      </label>
                      <textarea
                        value={member.healthInfo}
                        onChange={(e) => handleMemberChange(index, 'healthInfo', e.target.value)}
                        rows="3"
                        placeholder="Please mention any health conditions, allergies, or dietary restrictions"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {teamMembers.length < trek.maxGroupSize && (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMember}
                  leftIcon={<Plus size={16} />}
                >
                  Add Team Member
                </Button>
              </div>
            )}

            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold">Total Amount</h3>
                  <p className="text-sm text-gray-500">Price per person: ${trek.price}</p>
                </div>
                <div className="text-2xl font-bold text-primary-500">
                  ${trek.price * teamMembers.length}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Link to={`/treks/${id}`} className="mr-4">
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrekRegistrationPage;