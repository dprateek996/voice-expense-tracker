import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('🎨 App component rendering');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside Dashboard */}
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<div className="p-8 text-center text-muted-foreground">Analytics coming soon...</div>} />
          <Route path="history" element={<div className="p-8 text-center text-muted-foreground">History coming soon...</div>} />
          <Route path="categories" element={<div className="p-8 text-center text-muted-foreground">Categories coming soon...</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings coming soon...</div>} />
        </Route>
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
