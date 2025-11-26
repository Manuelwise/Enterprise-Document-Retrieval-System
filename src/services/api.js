import axios from 'axios';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For sending cookies with requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerAdmin: (userData) => api.post('/auth/admin', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getHeartbeat: () => api.post('/users/heartbeat'),
  updateEmail: (emailData) => api.put('/users/update-email', emailData),
  updatePassword: (passwordData) => api.put('/users/update-password', passwordData),
  getAllUsers: () => api.get('/users/all-users'),
  getActiveSessions: () => api.get('/users/active-sessions'),
  getUserStatus: (userId) => api.get(`/users/status/${userId}`),
};

// Activities API
export const activitiesAPI = {
  getActivities: () => api.get('/activities'),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (activityData) => api.post('/activities', activityData),
  updateActivity: (id, activityData) => api.put(`/activities/${id}`, activityData),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
};

// Announcements API
// export const announcementsAPI = {
//   getAnnouncements: () => api.get('/announcements'),
//   getAnnouncement: (id) => api.get(`/announcements/${id}`),
//   createAnnouncement: (announcementData) => api.post('/announcements', announcementData),
//   updateAnnouncement: (id, announcementData) => api.put(`/announcements/${id}`, announcementData),
//   deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
// };

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  getNotification: (id) => api.get(`/notifications/${id}`),
  createNotification: (notificationData) => api.post('/notifications', notificationData),
  updateNotification: (id, notificationData) => api.put(`/notifications/${id}`, notificationData),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Records API
// export const recordsAPI = {
//   getRecords: () => api.get('/records'),
//   getRecord: (id) => api.get(`/records/${id}`),
//   createRecord: (recordData) => api.post('/records', recordData),
//   updateRecord: (id, recordData) => api.put(`/records/${id}`, recordData),
//   deleteRecord: (id) => api.delete(`/records/${id}`),
// };

// Reports API
export const reportsAPI = {
  getReports: () => api.get('/reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  createReport: (reportData) => api.post('/reports', reportData),
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

// Requests API
export const requestsAPI = {
  getRequests: () => api.get('/requests'),
  getRequest: (id) => api.get(`/requests/${id}`),
  createRequest: (requestData) => api.post('/requests', requestData),
  updateRequest: (id, requestData) => api.put(`/requests/${id}`, requestData),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
};

// Microsoft Auth API
// export const microsoftAuthAPI = {
//   login: () => window.location.href = '/microsoft/auth',
//   callback: (code) => api.get(`/microsoft/callback?code=${code}`),
//   logout: () => api.get('/microsoft/logout'),
// };

export default api;
