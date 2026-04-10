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

const AUTH_HEADER_STORAGE_KEY = "sum_auth_header";

function AppRoutes({ user, onLogin, onLogout, onProfileUpdate }) {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const firstRender = useRef(true);
  const isAuthenticated = Boolean(user);
  const isTechnician = user?.role === "TECHNICIAN";

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
  const renderNonTechnicianProtected = (element) =>
    !isAuthenticated ? <Navigate to="/" replace /> : isTechnician ? <Navigate to="/tickets" replace /> : element;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isTechnician ? (
              <Navigate to="/tickets" replace />
            ) : (
              <LandingPage user={user} onLogout={onLogout} />
            )
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
          element={renderNonTechnicianProtected(<ResourcesPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/bookings"
          element={renderNonTechnicianProtected(<BookingsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/tickets"
          element={renderProtected(<TicketsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/notifications"
          element={renderNonTechnicianProtected(<NotificationsPage onLogout={onLogout} user={user} />)}
        />
        <Route
          path="/profile"
          element={renderNonTechnicianProtected(
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
    const savedAuthHeader = localStorage.getItem(AUTH_HEADER_STORAGE_KEY);
    if (savedAuthHeader) {
      axios.defaults.headers.common["Authorization"] = savedAuthHeader;
      apiClient.defaults.headers.common["Authorization"] = savedAuthHeader;
    }

    // Check if the user is already logged in via session (OAuth2)
    const checkUser = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        // Not logged in or session expired; clear stale basic auth header if any.
        localStorage.removeItem(AUTH_HEADER_STORAGE_KEY);
        delete axios.defaults.headers.common['Authorization'];
        delete apiClient.defaults.headers.common['Authorization'];
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
    localStorage.removeItem(AUTH_HEADER_STORAGE_KEY);
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