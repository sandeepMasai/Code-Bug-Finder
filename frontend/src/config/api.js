// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  BUGS: {
    FIND: `${API_BASE_URL}/bugs/find-bugs`,
  },
  HISTORY: {
    SAVE: `${API_BASE_URL}/history/save`,
    ALL: `${API_BASE_URL}/history/all`,
    GET: (id) => `${API_BASE_URL}/history/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/history/${id}`,
    DELETE: (id) => `${API_BASE_URL}/history/${id}`,
  },
};

export default API_BASE_URL;

