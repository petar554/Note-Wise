import axios from 'axios';

const API_URL = '/api'

export const login = async (username, password, language_id) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
      language_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/notes`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const addImageToNote = async (noteId, image, token) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await axios.post(`${API_URL}/notes/${noteId}/images`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getImageById = async (imageId, token) => {
  const response = await axios.get(`${API_URL}/images/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });
  return response.data;
};