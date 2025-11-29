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
        // This now runs on every single application load to verify the cookie/token.
        // It is the single source of truth for authentication.
<<<<<<< HEAD
        await fetchMe();
=======
        const data = await fetchMe();
        // If successful, ensure store is synced (optional but good)
        if (data.user && token) {
          login(data.user, token);
        }
>>>>>>> updated-design
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

  // TEMPORARY: Allow access to settings page without authentication for testing
  // TODO: Remove this bypass once authentication is properly set up
  if (location.pathname.includes('/settings')) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;