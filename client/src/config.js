// src/config.js
const config = {
  // For local development
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  // For production deployment
  production: {
    API_BASE_URL: 'https://scraping-6p4v.onrender.com/api'
  }
};

// Determine which environment to use - Vite uses import.meta.env instead of process.env
const environment = import.meta.env.MODE === 'production' ? 'production' : 'development';

// Add this for debugging
console.log('Current environment:', environment);
console.log('Using API URL:', config[environment].API_BASE_URL);

// Export the appropriate configuration
export const API_BASE_URL = config[environment].API_BASE_URL;