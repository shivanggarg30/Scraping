import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import EventCard from './components/EventCard';
import EmailModal from './components/EmailModal';
import Navbar from './components/Navbar';
import { useLocation } from 'react-router-dom';

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventUrl, setSelectedEventUrl] = useState('');

  // Fetch events from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  // Handle "Get Tickets" button click
  const handleGetTickets = (url) => {
    setSelectedEventUrl(url);
    setShowModal(true);
  };

  // Close the email modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEventUrl('');
  };

  return (
    <Router>
      <div className="container">
        <Navbar />
      </div>

      <div className="App">
        <Routes>
        <Route path="/" element={
  <>
    <h1 className="title">-- Australian Events --</h1>
    <div className="event-list">
      {events.length === 0 ? (
        <p>Loading events...</p>
      ) : (
        events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            url={event.link}
            onGetTickets={() => handleGetTickets(event.link)}
          />
        ))
      )}
    </div>
    {showModal && (
      <EmailModal
        eventUrl={selectedEventUrl}
        onClose={closeModal}
      />
    )}
  </>
} />
<Route path="/redirect" element={<RedirectPage />} />


          {/* Example route: could be used in future for internal event detail pages */}
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>

        {showModal && (
          <EmailModal eventUrl={selectedEventUrl} onClose={closeModal} />
        )}
      </div>
    </Router>
  );
}


const RedirectPage = () => {
  const location = useLocation();
  const eventUrl = location.state?.eventUrl;

  if (eventUrl) {
    window.location.href = eventUrl;
    return <p>Redirecting to event...</p>;
  } else {
    return <p>Invalid redirect URL.</p>;
  }
};


const EventDetail = () => (
  <div className="page-container">
    <h1>Event Details</h1>
    <p>This is where the event details will be displayed.</p>
  </div>
);


export default App;
