const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { scrapeEvents } = require('./scraper/eventbrite');

require('dotenv').config();

const app = express();

// ✅ CORS setup for Netlify frontend
const allowedOrigins = [
  'http://localhost:5173', // Dev frontend
  'https://scrapingevents.netlify.app/' // Replace with your actual Netlify frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));



app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// Import routes
const otpRoutes = require('./routes/otp');
app.use('/api', otpRoutes);

// Cached events
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

// API: Get events
app.get('/api/events', (req, res) => {
  res.json(cachedEvents);
});

// API: Email collection
app.post('/api/email', (req, res) => {
  const { email } = req.body;
  console.log('Email collected:', email);
  res.json({ success: true });
});

// Start server (No default port, only process.env.PORT)
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
