import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="dark text-foreground bg-background relative min-h-screen">
      {/* Modern background elements with warm tones */}
      <div className="fixed inset-0 z-[-2] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(64,54,48,0.25),transparent),radial-gradient(ellipse_60%_90%_at_90%_50%,rgba(48,42,38,0.18),transparent),radial-gradient(ellipse_100%_80%_at_10%_80%,rgba(38,33,30,0.2),transparent)] bg-[hsl(var(--background))]"></div>
      <div className="fixed inset-0 z-[-1] bg-[linear-gradient(rgba(120,110,100,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,110,100,0.06)_1px,transparent_1px)] bg-[length:50px_50px] bg-[position:-1px_-1px]"></div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="history" element={<History />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors theme="dark" />
    </div>
  );
}

export default App;