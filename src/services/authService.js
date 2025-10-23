import apiClient from './apiClient';

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email, code) => {
  try {
    const response = await apiClient.post('/users/verify', { email, code });
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  // return {
  //   _id: 'temp123',
  //   name: 'Temp User',
  //   email: 'temp@example.com',
  //   isAdmin: true,
  //   isVerified: true,
  //   createdAt: new Date().toISOString()
  // };
  try {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }

    const response = await apiClient.get('/users/me');
    // console.log('Current user data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    
    // If token is invalid or expired, remove it
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid, removing from localStorage');
      localStorage.removeItem('token');
    }
    
    return null;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await apiClient.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestProfileUpdate = async () => {
  try {
    const response = await apiClient.post('/users/request-profile-update');
    return response.data;
  } catch (error) {
    throw error;
  }
};