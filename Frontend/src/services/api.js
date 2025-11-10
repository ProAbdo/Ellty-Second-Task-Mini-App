const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      // Re-throw if it's already an Error object
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise wrap in Error
      throw new Error(error.message || 'Request failed');
    }
  }

  // Auth endpoints
  async register(username, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Calculation endpoints
  async getAllCalculations() {
    return this.request('/calculations');
  }

  async getCalculationById(id) {
    return this.request(`/calculations/${id}`);
  }

  async createStartingNumber(startingNumber) {
    return this.request('/calculations/starting-number', {
      method: 'POST',
      body: JSON.stringify({ startingNumber }),
    });
  }

  async addOperation(parentId, operationType, rightOperand) {
    return this.request('/calculations/operation', {
      method: 'POST',
      body: JSON.stringify({ parentId, operationType, rightOperand }),
    });
  }
}

export default new ApiService();

