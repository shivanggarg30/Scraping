import React from 'react';
import './EventCard.css';

function EventCard({ title, link, onGetTickets }) {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <button class="absol" onClick={() => onGetTickets(link)}>Get Tickets</button>
    </div>
  );
}

export default EventCard;
