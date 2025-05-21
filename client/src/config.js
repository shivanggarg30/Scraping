// src/config.js

// First, try to use environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || // Netlify, Vite, etc.
  (import.meta.env.MODE === 'production'
    ? 'https://scraping-gamma.vercel.app/api' // Your deployed backend on Vercel
    : 'http://localhost:5000/api');            // Local dev fallback

// Debug logging (optional)
console.log('Environment Mode:', import.meta.env.MODE);
console.log('Using API Base URL:', API_BASE_URL);

export { API_BASE_URL };
