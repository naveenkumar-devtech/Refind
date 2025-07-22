import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import all your page components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ReportLost from './components/ReportLost';
import ReportFound from './components/ReportFound';
import ItemDetailPage from './components/ItemDetailPage'; 
import ChatPage from './components/ChatPage';
import Matches from './components/Matches';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import ContactUs from './components/ContactUs';
import Developers from './components/Developers';
import ChatAssistant from './components/ChatAssistant'; // Add this import
import './App.css';

/**
 * A wrapper component to protect routes that require authentication.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * The main content component that defines all the application routes.
 */
const AppContent = () => {
  const navigate = useNavigate();

  const handleStart = () => navigate('/auth');
  const handleBack = () => navigate('/');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage onStart={handleStart} />} />
      <Route path="/auth" element={<AuthPage onBack={handleBack} />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/developers" element={<Developers />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
      <Route path="/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/items/:itemId" element={<ProtectedRoute><ItemDetailPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/chat-assistant" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} /> {/* Add this route */}
      
      {/* Fallback route for any unknown paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

/**
 * The root App component.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;