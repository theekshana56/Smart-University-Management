import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import BookingsPage from "./pages/BookingsPage";
import TicketsPage from "./pages/TicketsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ManageUsersPage from "./pages/ManageUsersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LandingPage from "./pages/LandingPage";
import AppLoader from "./components/common/AppLoader";

function AppRoutes({ user, onLogin, onLogout, onProfileUpdate }) {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const firstRender = useRef(true);
  const isAuthenticated = Boolean(user);

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

  const renderProtected = (element) =>
    isAuthenticated ? element : <Navigate to="/" replace />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage user={user} onLogout={onLogout} />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={onLogin} initialMode="login" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={onLogin} initialMode="signup" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : user?.role === "ADMIN" ? (
              <AdminDashboardPage onLogout={onLogout} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/resources"
          element={renderProtected(<ResourcesPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/bookings"
          element={renderProtected(<BookingsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/tickets"
          element={renderProtected(<TicketsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/notifications"
          element={renderProtected(<NotificationsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/profile"
          element={renderProtected(
            <ProfilePage onLogout={onLogout} user={user} onProfileUpdate={onProfileUpdate} />
          )}
        />
        <Route
          path="/settings"
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : user?.role === "ADMIN" ? (
              <SettingsPage onLogout={onLogout} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/manage-users"
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : user?.role === "ADMIN" ? (
              <ManageUsersPage onLogout={onLogout} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
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
      await apiClient.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Server-side logout failed or session already expired", err);
    }
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    delete apiClient.defaults.headers.common['Authorization'];
  };

  if (checkingAuth) {
    return <AppLoader label="Loading session..." variant="fullscreen" />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes
        user={user}
        onLogin={(userData) => setUser(userData)}
        onLogout={handleLogout}
        onProfileUpdate={(updatedUser) => setUser(updatedUser)}
      />
    </BrowserRouter>
  );
}