import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHomeRedesigned from './pages/DashboardHomeRedesigned';
import ProtectedRoute from './components/ProtectedRoute';
import useThemeStore from './store/themeStore';

const Analytics = lazy(() => import('./pages/Analytics'));
const History = lazy(() => import('./pages/History'));
const Categories = lazy(() => import('./pages/Categories'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="flex min-h-80 items-center justify-center text-muted-foreground">Loading...</div>
);

function App() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
            )}
            >
              <Route index element={<DashboardHomeRedesigned />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="history" element={<History />} />
              <Route path="categories" element={<Categories />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster richColors theme={theme} />
    </div>
  );
}

export default App;
