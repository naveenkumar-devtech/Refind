import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* <-- WRAP YOUR APP */}
    <NotificationProvider> {/* <-- WRAP YOUR APP */}
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);