import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getNotifications } from '../services/api';
import { Search, Bell, ChevronLeft, Sparkles, Clock, MessageSquare, RefreshCw } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { unreadCount, setUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(() => {
    return localStorage.getItem('notificationsShowAll') === 'true';
  });

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Fetching notifications for user:', currentUser?.username);
      const data = await getNotifications(showAll, false); // mark_read=false
      console.log('Notifications data:', data);
      const validNotifications = Array.isArray(data) ? data : [];
      setNotifications(validNotifications);
      setUnreadCount(showAll ? validNotifications.length : validNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Error fetching notifications:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate('/auth');
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later or contact support.");
      } else {
        setError(err.response?.data?.detail || "Failed to load notifications. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setError("Please log in to view notifications.");
      setIsLoading(false);
      navigate('/auth');
      return;
    }
    fetchNotifications();
  }, [currentUser, showAll, navigate]);

  useEffect(() => {
    localStorage.setItem('notificationsShowAll', showAll);
  }, [showAll]);

  const handleNotificationClick = (notification) => {
    if (notification.item && notification.sender) {
      console.log('Notification clicked:', notification);
      navigate(`/chat?item_id=${notification.item}&receiver_id=${notification.sender}`);
    } else {
      console.error('Invalid notification data:', notification);
      setError("Invalid notification data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-40 sm:w-48 h-40 sm:h-48 md:w-64 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-8 sm:-left-10 w-32 sm:w-40 h-32 sm:h-40 md:w-48 md:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/30 shadow-md">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                refind
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 sm:-top-1.5 -right-1 sm:-right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-purple-500/20 hover:border-cyan-400/40 text-gray-300 hover:text-cyan-400 transition-all duration-300 group text-xs sm:text-sm"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-8 sm:pb-12 relative z-10">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notifications
          </h1>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => setShowAll(false)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${!showAll ? 'bg-cyan-400 text-white' : 'bg-slate-800/60 text-gray-300'} hover:bg-cyan-400/80 hover:text-white transition-all duration-300`}
            >
              Unread Only
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${showAll ? 'bg-cyan-400 text-white' : 'bg-slate-800/60 text-gray-300'} hover:bg-cyan-400/80 hover:text-white transition-all duration-300`}
            >
              All Notifications
            </button>
            <button
              onClick={fetchNotifications}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-gray-300 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="max-w-xl sm:max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-purple-900/30 rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 border border-purple-500/20 backdrop-blur-xl">
            {isLoading ? (
              <div className="text-center text-white py-6 sm:py-8">Loading notifications...</div>
            ) : error ? (
              <div className="text-center text-red-400 py-6 sm:py-8">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-1 sm:mb-2">All caught up!</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {showAll ? 'No notifications available.' : 'No new notifications at the moment.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="group relative bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 border-l-cyan-400/60 hover:bg-slate-700/70 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-slate-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                          <h4 className="text-sm sm:text-base font-semibold text-white line-clamp-1">New Message Received</h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-400 flex-shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="line-clamp-1">{new Date(notification.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-0.5 sm:mb-1 line-clamp-1">
                          From: <span className="font-medium text-white">{notification.sender_username}</span>
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                          Message: <span className="italic">"{notification.message}"</span>
                        </p>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;