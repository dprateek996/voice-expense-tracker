import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="dark text-foreground bg-background">
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
            <Route path="analytics" element={<div className="p-8 text-center"><h1 className='text-3xl font-bold'>Analytics coming soon...</h1></div>} />
            <Route path="history" element={<div className="p-8 text-center"><h1 className='text-3xl font-bold'>History coming soon...</h1></div>} />
            <Route path="categories" element={<div className="p-8 text-center"><h1 className='text-3xl font-bold'>Categories coming soon...</h1></div>} />
            <Route path="settings" element={<div className="p-8 text-center"><h1 className='text-3xl font-bold'>Settings coming soon...</h1></div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors theme="dark" />
    </div>
  );
}

export default App;