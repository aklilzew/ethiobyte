import axios from 'axios';

// Define the base API URL
const API_BASE_URL = 'https://server.fabe.ethiopbytes.com/api';

// Main Axios instance for JSON API calls
export const axiosJsonInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// File upload Axios instance - always uses the production URL
export const axiosFileInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 'Content-Type' will be set automatically for FormData
  }
});

// Add interceptors to both instances
const setupInterceptors = (instance) => {
  // Request interceptor for adding token
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for token refresh
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken: localStorage.getItem('refreshToken')
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
          localStorage.setItem('token', data.token);
          instance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both instances
setupInterceptors(axiosJsonInstance);
setupInterceptors(axiosFileInstance);


// API methods (ensure gallery.addMedia uses axiosFileInstance)
export default {
  users: {
    getAll: () => axiosJsonInstance.get('/users'),
    getById: (userId) => axiosJsonInstance.get(`/users/${userId}`),
    updateRole: (userId, role) => axiosJsonInstance.put(`/users/${userId}/role`, { role }),
    delete: (userId) => axiosJsonInstance.delete(`/users/${userId}`),
  },
  auth: {
    login: (credentials) => axiosJsonInstance.post('/users/login', credentials),
    register: (userData) => axiosJsonInstance.post('/users/register', userData),
    refreshToken: (refreshToken) => axiosJsonInstance.post('/users/refresh-token', { refreshToken }),
    getProfile: () => axiosJsonInstance.get('/users/me'),
    updateProfile: (profileData) => axiosJsonInstance.put('/users/me', profileData)
  },
  posts: {
    getAll: () => axiosJsonInstance.get('/posts'),
    getBySlug: (slug) => axiosJsonInstance.get(`/posts/${slug}`),
    create: (postData) => axiosJsonInstance.post('/posts', postData),
    update: (id, postData) => axiosJsonInstance.put(`/posts/${id}`, postData),
    delete: (id) => axiosJsonInstance.delete(`/posts/${id}`),
    comments: {
      get: (postId) => axiosJsonInstance.get(`/posts/${postId}/comments`),
      create: (postId, commentData) => axiosJsonInstance.post(`/posts/${postId}/comments`, commentData),
      update: (commentId, commentData) => axiosJsonInstance.put(`/posts/comments/${commentId}`, commentData),
      delete: (commentId) => axiosJsonInstance.delete(`/posts/comments/${commentId}`)
    }
  },
  products: {
    getAll: () => axiosJsonInstance.get('/products'),
    getById: (id) => axiosJsonInstance.get(`/products/${id}`),
    create: (productData) => axiosJsonInstance.post('/products', productData),
    update: (id, productData) => axiosJsonInstance.put(`/products/${id}`, productData),
    delete: (id) => axiosJsonInstance.delete(`/products/${id}`),
    byCategory: (categoryId) => axiosJsonInstance.get(`/categories/${categoryId}/products`)
  },
  orders: {
    getMine: () => axiosJsonInstance.get('/orders'),
    create: (orderData) => axiosJsonInstance.post('/orders', orderData),
    getDetails: (id) => axiosJsonInstance.get(`/orders/${id}`),
    cancel: (id) => axiosJsonInstance.put(`/orders/${id}/cancel`),
    getAll: () => axiosJsonInstance.get('/orders/admin/all'),
    updateStatus: (id, status) => axiosJsonInstance.put(`/orders/admin/${id}/status`, { status })
  },
 gallery: {
    getAll: () => axiosJsonInstance.get('/galleries'),
    getById: (id) => axiosJsonInstance.get(`/galleries/${id}`),
    create: (galleryData) => axiosJsonInstance.post('/galleries', galleryData),
    addMedia: (galleryId, filesFormData) => axiosFileInstance.post(`/galleries/${galleryId}/media`, filesFormData),
    removeMedia: (galleryId, mediaId) => axiosJsonInstance.delete(`/galleries/${galleryId}/media/${mediaId}`)
  },
  jobs: {
    getAll: () => axiosJsonInstance.get('/jobs'),
    getBySlug: (slug) => axiosJsonInstance.get(`/jobs/${slug}`),
    getCategories: () => axiosJsonInstance.get('/jobs/categories'),
    create: (jobData) => axiosJsonInstance.post('/jobs', jobData),
    update: (id, jobData) => axiosJsonInstance.put(`/jobs/${id}`, jobData),
    delete: (id) => axiosJsonInstance.delete(`/jobs/${id}`)
  },
  newsletter: {
    subscribe: (email) => axiosJsonInstance.post('/newsletter/subscribe', { email }),
    confirm: (token) => axiosJsonInstance.get(`/newsletter/confirm/${token}`),
    unsubscribe: (token) => axiosJsonInstance.post('/newsletter/unsubscribe', { token })
  },
  contact: {
    send: (messageData) => axiosJsonInstance.post('/contact', messageData),
    getAll: () => axiosJsonInstance.get('/contact'),
    updateStatus: (id, status) => axiosJsonInstance.put(`/contact/${id}/status`, { status })
  },
  rfqs: {
    getAll: () => axiosJsonInstance.get('/rfqs'),
    getAllRFQS: () => axiosJsonInstance.get('/rfqs/all'),
    create: (rfqData) => axiosJsonInstance.post('/rfqs', rfqData),
    getDetails: (id) => axiosJsonInstance.get(`/rfqs/${id}`),
    update: (id, rfqData) => axiosJsonInstance.put(`/rfqs/${id}`, rfqData),
    delete: (id) => axiosJsonInstance.delete(`/rfqs/${id}`),
    items: {
      add: (rfqId, itemData) => axiosJsonInstance.post(`/rfqs/${rfqId}/items`, itemData),
      update: (rfqId, itemId, itemData) => axiosJsonInstance.put(`/rfqs/${rfqId}/items/${itemId}`, itemData)
    },
    responses: {
      submit: (rfqId, responseData) => axiosJsonInstance.post(`/rfqs/${rfqId}/responses`, responseData),
      get: (rfqId) => axiosJsonInstance.get(`/rfqs/${rfqId}/responses`)
    }
  },
  categories: {
    getAll: () => axiosJsonInstance.get('/categories'),
    create: (categoryData) => axiosJsonInstance.post('/categories', categoryData),
    update: (id, categoryData) => axiosJsonInstance.put(`/categories/${id}`, categoryData),
    delete: (id) => axiosJsonInstance.delete(`/categories/${id}`),
    getTree: () => axiosJsonInstance.get('/categories/tree')
  },
  upload: {
    avatar: (fileFormData) => axiosFileInstance.post('/users/me/avatar', fileFormData),
    productImage: (productId, fileFormData) => axiosFileInstance.post(`/products/${productId}/image`, fileFormData)
  }
};