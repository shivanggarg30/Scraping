const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { scrapeEvents } = require('./scraper/eventbrite');

const app = express();
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const otpRoutes = require('./routes/otp');

// Use routes
app.use('/api', otpRoutes);

let cachedEvents = [];

// Initial scrape on server start
(async () => {
  cachedEvents = await scrapeEvents();
})();

// Auto-refresh every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Refreshing event list...');
  cachedEvents = await scrapeEvents();
});

// GET /api/events → Return scraped events
app.get('/api/events', (req, res) => {
  res.json(cachedEvents);
});

// Create a simple email collection route
app.post('/api/email', (req, res) => {
  const { email } = req.body;
 
  console.log('Email collected:', email);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
