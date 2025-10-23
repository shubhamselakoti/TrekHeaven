import apiClient from './apiClient';

export const getAllTreks = async () => {
  try {
    const response = await apiClient.get('/treks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrekById = async (id) => {
  try {
    const response = await apiClient.get(`/treks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerForTrek = async (
  trekId,
  startDate,
  teamMembers
) => {
  try {
    const response = await apiClient.post('/trek-registrations', {
      trek: trekId,
      startDate,
      teamMembers
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRegistrations = async () => {
  try {
    const response = await apiClient.get('/trek-registrations/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelRegistration = async (registrationId) => {
  try {
    const response = await apiClient.put(`/trek-registrations/${registrationId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrek = async (id) => {
  try {
    const response = await apiClient.delete(`/treks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTrek = async (id, data) => {
  try {
    const response = await apiClient.patch(`/treks/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTrek = async (data) => {
  try {
    const response = await apiClient.post('/treks', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllRegistrations = async () => {
  try {
    const response = await apiClient.get('/users/allregistrations');
    return response.data;
  } catch (error) {
    throw error;
  }
};