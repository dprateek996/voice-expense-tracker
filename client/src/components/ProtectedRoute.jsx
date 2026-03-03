import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { fetchMe } from '../api/auth.api';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login, logout, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyUserSession = async () => {
      if (isAuthenticated) {
        if (isMounted) setIsLoading(false);
        return;
      }

      if (token) {
        try {
          const data = await fetchMe();
          if (isMounted && data.user) {
            login(data.user, token);
          }
        } catch {
          console.error("Session verification failed. User is not logged in.");
          if (isMounted) logout();
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyUserSession();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, login, logout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-xl font-semibold">Verifying Session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
