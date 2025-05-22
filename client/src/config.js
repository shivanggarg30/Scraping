const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: 'https://scraping-6p4v.onrender.com' // Replace with your actual Render backend URL
  }
};

const environment = import.meta.env.MODE === 'production' ? 'production' : 'development';

console.log('Current environment:', environment);
console.log('Using API URL:', config[environment].API_BASE_URL);

export const API_BASE_URL = config[environment].API_BASE_URL;
