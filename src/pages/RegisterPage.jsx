import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [step, setStep] = useState(() => {
    // Check if there's a pending verification
    const pendingEmail = localStorage.getItem('pendingVerification');
    return pendingEmail ? 2 : 1;
  });

  const [formData, setFormData] = useState({
    name: '',
    email: localStorage.getItem('pendingVerification') || '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, verify } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);

      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        // Store email for verification
        localStorage.setItem('pendingVerification', formData.email);
        setStep(2);
      } catch (err) {
        console.error('Registration error:', err);
        setError(
          err.response?.data?.message || 
          'Registration failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        await verify(formData.email, formData.verificationCode);
        localStorage.removeItem('pendingVerification');
        navigate('/');
      } catch (err) {
        console.error('Verification error:', err);
        setError(
          err.response?.data?.message || 
          'Verification failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '' };
    
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (hasLowercase) score += 1;
    if (hasUppercase) score += 1;
    if (hasDigit) score += 1;
    if (hasSpecial) score += 1;
    
    let text = '';
    let color = '';
    
    if (score <= 2) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      text = 'Moderate';
      color = 'bg-yellow-500';
    } else {
      text = 'Strong';
      color = 'bg-green-500';
    }
    
    return { score, text, color, percent: Math.min(100, (score / 6) * 100) };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Handle resend verification code
  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setError('A new verification code has been sent to your email.');
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:flex">
            <div className="md:shrink-0 bg-primary-500 md:w-24 flex md:flex-col justify-center items-center py-4 md:py-0">
              <Mountain className="h-12 w-12 text-white" />
            </div>
            <div className="p-8 w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {step === 1 ? 'Create an Account' : 'Verify Your Email'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {step === 1 ? 'Join IndiaTrekHeaven today' : 'Enter the verification code sent to your email'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="John Doe"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="you@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">Password strength:</span>
                            <span className="text-xs font-medium">{passwordStrength.text}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${passwordStrength.color}`} 
                              style={{ width: `${passwordStrength.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      
                      {formData.password && formData.confirmPassword && (
                        <div className="mt-1 flex items-center">
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs text-green-500">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-xs text-red-500">Passwords don't match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mb-6">
                    <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-1">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter 6-digit code"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Please check your email ({formData.email}) for the verification code.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="mt-2 text-primary-500 hover:text-primary-600 text-sm"
                      disabled={isLoading}
                    >
                      Resend verification code
                    </button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  isLoading={isLoading}
                >
                  {step === 1 ? 'Create Account' : 'Verify Email'}
                </Button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:underline">
                  Log in here
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;