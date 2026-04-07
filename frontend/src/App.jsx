import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import HomePage from "./pages/HomePage";
import BookingsPage from "./pages/BookingsPage";
import TicketsPage from "./pages/TicketsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AppLoader from "./components/common/AppLoader";

function AppRoutes({ user, onLogout }) {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (routeLoading) {
    return <AppLoader label="Loading page..." variant="fullscreen" />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage onLogout={onLogout} user={user} />} />

        {user?.role === "ADMIN" && (
          <Route
            path="/admin"
            element={<AdminDashboardPage onLogout={onLogout} user={user} />}
          />
        )}

        {/* Fallback: non-admins trying /admin are redirected home */}
        <Route
          path="/admin"
          element={<Navigate to="/" replace />}
        />

        <Route path="/resources" element={<ResourcesPage onLogout={onLogout} user={user} />} />
        <Route path="/bookings" element={<BookingsPage onLogout={onLogout} user={user} />} />
        <Route path="/tickets" element={<TicketsPage onLogout={onLogout} user={user} />} />
        <Route path="/notifications" element={<NotificationsPage onLogout={onLogout} user={user} />} />
        <Route path="/settings" element={<SettingsPage onLogout={onLogout} user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

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
    return <AppLoader label="Loading session..." variant="fullscreen" />;
  }

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes user={user} onLogout={handleLogout} />
    </BrowserRouter>
  );
}