import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

export const getUserNotes = async (token) => {
    const response = await api.get('/users/me/notes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.notes;
  };

export const addImageToNote = async (noteId, image, token) => {
    const formData = new FormData();
    formData.append('image', image);
  
    const response = await api.post(`/notes/${noteId}/images`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};