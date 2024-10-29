import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`, 
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post(`${API_URL}/auth/login`, { username, password })
  const { token } = response.data;

  localStorage.setItem('jwtToken', token);

  return token;
};

export const getUserNotes = async (token) => {
    const response = await api.get('/users/me/notes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.notes;
  };

export const createNote = async (token) => {
    const response = await api.post('/notes', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addImageToNote = async (noteId, image, token) => {
    const formData = new FormData();
    formData.append('image', image);
  
    const response = await api.post(`/notes/${noteId}/images`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
