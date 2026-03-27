import React from 'react';
import ResourceLayout from '../components/resource/ResourceLayout';

export default function TicketsPage({ onLogout, user }) {
  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div style={{ padding: '20px' }}>
        <h2>IT Service Tickets</h2>
        <p>This module is currently under construction.</p>
      </div>
    </ResourceLayout>
  );
}
