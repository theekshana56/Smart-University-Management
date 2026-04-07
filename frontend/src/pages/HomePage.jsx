import React from 'react';
import ResourceLayout from '../components/resource/ResourceLayout';

export default function HomePage({ onLogout, user }) {
  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div style={{ padding: '20px' }}>
        <h2>Dashboard / Home</h2>
        <p>Welcome to the Smart University Management System.</p>
      </div>
    </ResourceLayout>
  );
}
