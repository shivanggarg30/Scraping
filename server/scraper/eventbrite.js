const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeEvents() {
  const url = 'https://www.eventbrite.com.au/d/australia/events/';
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(data);
    const events = [];

    // Adjust selector based on actual HTML structure
    $('section.discover-vertical-event-card').each((i, el) => {
      const title = $(el).find('h3').text().trim(); // Extract event title from <h3>
      const link = $(el).find('a.event-card-link').attr('href'); // Extract event link from <a>

      // Make sure to prepend the base URL if the link is relative
      if (title && link) {
        const fullLink = link.startsWith('http') ? link : `https://www.eventbrite.com.au${link}`;
        events.push({
          title,
          link: fullLink,
        });
      }
    });

    console.log(`✅ Scraped ${events.length} events from Eventbrite`);
    return events;
  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    return [];
  }
}

module.exports = { scrapeEvents };
