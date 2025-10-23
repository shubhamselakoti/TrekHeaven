import apiClient from './apiClient';

export const getAllBlogs = async () => {
  try {
    const response = await apiClient.get('/blogs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    // Use the admin route for fetching by ID
    const response = await apiClient.get(`/blogs/id/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await apiClient.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await apiClient.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};