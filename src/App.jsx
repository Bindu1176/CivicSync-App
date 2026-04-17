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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-civic-light dark:bg-civic-dark">
      <Card className="w-[300px] glass border-transparent shadow-2xl rounded-2xl animate-fade-in">
        <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-civic-text animate-pulse tracking-wide">Loading CivicSync...</p>
        </CardContent>
      </Card>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="h-screen w-full bg-gray-100 dark:bg-black/95 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-[420px] h-full shadow-2xl relative transform scale-100 bg-civic-light dark:bg-civic-dark transition-colors duration-300 flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full h-full relative" id="app-root-scroll">
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
      </div>
    </div>
  );
}
