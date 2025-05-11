import React from 'react';
import EventCard from './EventCard';

function EventList({ events, onGetTickets }) {
  return (
    <div className="event-list">
      {events.map((event, index) => (
        <EventCard key={index} title={event.title} link={event.link} onGetTickets={onGetTickets} />
      ))}
    </div>
  );
}

export default EventList;
