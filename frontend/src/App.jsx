import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import ResourcesPage from "./pages/ResourcesPage.jsx";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

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