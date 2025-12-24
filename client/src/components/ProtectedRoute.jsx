import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { fetchMe } from '../api/auth.api';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login, logout, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const data = await fetchMe();
        if (data.user && token) {
          login(data.user, token);
        }
      } catch (error) {
        console.error("Session verification failed. User is not logged in.");
        logout(); // Explicitly logout on failure
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserSession();
  }, []); // The empty dependency array ensures this runs only ONCE on mount.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-xl font-semibold">Verifying Session...</div>
      </div>
    );
  }

  if (location.pathname.includes('/settings')) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;