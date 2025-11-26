// src/services/adminAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your actual backend URL

const adminAPI = {
  // Users
  getAllUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/all-users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/active-sessions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  },

  // Request Statistics
  getRequestCounts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests/stats/counts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data; // Returns { pending, approved, rejected, dispatched, returned }
    } catch (error) {
      console.error('Error fetching request counts:', error);
      // Return default counts in case of error
      return { 
        pending: 0, 
        approved: 0, 
        rejected: 0, 
        dispatched: 0, 
        returned: 0 
      };
    }
  },

 // Activities
    getActivities: async (limit = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/activity`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        params: {
            limit: 5
        }
        });
        return { data: response.data.data || [] };
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
    }
    },

//   getUserActivities: async (userId) => {
//     const response = await axios.get(`${API_BASE_URL}/activities/user/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}` 
//       }
//     });
//     return response.data;
//   },

  // Records (Requests)
  getRecords: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          limit: 3, // Get only 3 most recent requests
          sort: '-requestDate' // Sort by requestDate in descending order
        }
      });
      // The API returns an array directly, so we wrap it in a data property
      // to maintain consistency with other API responses
      return { data: Array.isArray(response.data) ? response.data.slice(0, 3) : [] };
    } catch (error) {
      console.error('Error fetching requests:', error);
      return { data: [] }; // Return empty array if there's an error
    }
  },
  getAllRequests: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          sort: '-requestDate' // Sort by requestDate in descending order
        }
      });
      // The API returns an array directly, so we wrap it in a data property
      // to maintain consistency with other API responses
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error('Error fetching requests:', error);
      return { data: [] }; // Return empty array if there's an error
    }
  },


  updateRecord: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/records/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Reports
  generateReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/reports`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  }
};

export default adminAPI;