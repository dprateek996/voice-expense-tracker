import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { fetchMe } from '../api/auth.api';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login, logout, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        // This now runs on every single application load to verify the cookie/token.
        // It is the single source of truth for authentication.
        const data = await fetchMe();
        // If successful, ensure store is synced (optional but good)
        if (data.user && token) {
          login(data.user, token);
        }
      } catch (error) {
        // The fetchMe function already handles logging the user out of the store on failure.
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
        {/* Replace with a spinner component later */}
        <div className="text-xl font-semibold">Verifying Session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;