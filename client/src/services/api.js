import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateDetails: (data) => API.put('/auth/updatedetails', data),
  updatePassword: (data) => API.put('/auth/updatepassword', data)
};

// Post API
export const postAPI = {
  getPosts: (params) => API.get('/posts', { params }),
  getPost: (id) => API.get(`/posts/${id}`),
  getUserPosts: (userId) => API.get(`/posts/user/${userId}`),
  createPost: (data) => API.post('/posts', data),
  updatePost: (id, data) => API.put(`/posts/${id}`, data),
  deletePost: (id) => API.delete(`/posts/${id}`),
  likePost: (id) => API.put(`/posts/${id}/like`),
  addComment: (id, data) => API.post(`/posts/${id}/comment`, data),
  deleteComment: (id, commentId) => API.delete(`/posts/${id}/comment/${commentId}`)
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// User API (Admin only)
export const userAPI = {
  getUsers: () => API.get('/users'),
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`)
};

export default API;
