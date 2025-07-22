
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getNotificationSummary } from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const fetchSummary = async () => {
        try {
          console.log('Fetching notification summary for user:', currentUser);
          const summary = await getNotificationSummary();
          console.log('Notification summary:', summary);
          setUnreadCount(summary.unread_messages || 0);
        } catch (error) {
          console.error('Failed to fetch notification summary:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
        }
      };
      fetchSummary();
      const interval = setInterval(fetchSummary, 15000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [currentUser]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
