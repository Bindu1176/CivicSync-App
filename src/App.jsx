import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import ServiceDetail from './pages/ServiceDetail';
import Notifications from './pages/Notifications';
import ProgressTrackerPage from './pages/ProgressTrackerPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-civic-light dark:bg-civic-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-civic-light dark:bg-civic-dark transition-colors duration-300">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/module/:moduleId" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
        <Route path="/module/:moduleId/:submoduleId" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressTrackerPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
