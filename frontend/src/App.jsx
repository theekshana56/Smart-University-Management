import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import ResourcesPage from "./pages/ResourcesPage.jsx";
import LoginPage from "./pages/LoginPage";
<<<<<<< Updated upstream
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
=======
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
>>>>>>> Stashed changes

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
    <>
      {currentPage === 'Home' && <HomePage onLogout={handleLogout} user={user} onNavigate={setCurrentPage} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'Resources' && <ResourcesPage onLogout={handleLogout} user={user} onNavigate={setCurrentPage} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'Admin' && user?.role === 'ADMIN' && <AdminPage onLogout={handleLogout} user={user} onNavigate={setCurrentPage} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'Settings' && <SettingsPage onLogout={handleLogout} user={user} onNavigate={setCurrentPage} onUpdateUser={setUser} theme={theme} onToggleTheme={toggleTheme} />}
    </>
  );
}