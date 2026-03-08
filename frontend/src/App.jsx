import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from './api/apiClient';
import ResourcesPage from "./pages/ResourcesPage.jsx";
import LoginPage from "./pages/LoginPage";

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
    <ResourcesPage onLogout={handleLogout} user={user} />
  );
}