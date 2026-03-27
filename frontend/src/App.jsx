import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import HomePage from "./pages/HomePage";
import BookingsPage from "./pages/BookingsPage";
import TicketsPage from "./pages/TicketsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in via session (OAuth2)
    const checkUser = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        // Not logged in or session expired
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    delete apiClient.defaults.headers.common['Authorization'];
  };

  if (checkingAuth) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>Loading...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage onLogout={handleLogout} user={user} />} />
        <Route path="/resources" element={<ResourcesPage onLogout={handleLogout} user={user} />} />
        <Route path="/bookings" element={<BookingsPage onLogout={handleLogout} user={user} />} />
        <Route path="/tickets" element={<TicketsPage onLogout={handleLogout} user={user} />} />
        <Route path="/notifications" element={<NotificationsPage onLogout={handleLogout} user={user} />} />
        <Route path="/settings" element={<SettingsPage onLogout={handleLogout} user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}