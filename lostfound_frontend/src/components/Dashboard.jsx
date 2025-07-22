import React, { useState, useEffect } from 'react';
import {
  Search, Bell, User, XCircle, CheckCircle, Zap, Bot, TrendingUp, Clock, MapPin, ArrowRight, MessageCircle, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, getMyItems, approveClaim, updateItemStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ItemCard = ({ item, colorClass, onNavigate, showClaimInfo = false, onApproveClaim, onUpdateStatus, loading, itemStatus }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const receiverId = item.user === currentUser.id
    ? item.claim_status?.claimer_id
    : item.user;

  const handleChatNavigate = () => {
    if (!receiverId) {
      console.error('Cannot navigate to chat: receiverId is undefined', { item });
      return;
    }
    navigate(`/chat?item_id=${item.id}&receiver_id=${receiverId}`);
  };

  return (
    <div className={`bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-purple-500/30 hover:border-${colorClass}-400/50 transition-all duration-300 flex flex-col min-h-[160px] sm:min-h-[180px] shadow-md hover:shadow-lg hover:shadow-${colorClass}-500/20`}>
      <h4 className={`font-semibold text-white text-sm sm:text-base truncate hover:text-${colorClass}-300 transition-colors`}>{item.title}</h4>
      <p className="text-gray-300 text-xs sm:text-sm mt-1 mb-2 flex-grow line-clamp-2">{item.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-purple-500/30 pt-2">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>
      </div>

      {showClaimInfo && (
        <div className="mt-2 space-y-2">
          {item.claim_status && (
            <>
              <p className="text-gray-300 text-xs sm:text-sm">
                {item.claim_status.status === 'approved' || item.is_claimed ? 'Claimed' :
                 item.claim_status.status === 'pending' ? 'Claim Pending' : 'Claim Rejected'}:{' '}
                <span className="text-white">{item.claim_status.claimer_username}</span>
              </p>
              <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">Note: {item.claim_status.claim_note}</p>
            </>
          )}
          {item.claim_status?.status === 'pending' && (
            <button
              onClick={() => onApproveClaim(item.id)}
              disabled={loading[item.id]}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm font-medium hover:from-green-700 hover:to-emerald-700 ${loading[item.id] ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
            >
              {loading[item.id] ? 'Approving...' : 'Approve Claim'}
            </button>
          )}
          {!(item.is_claimed || item.status === 'claimed') && (
            <button
              onClick={() => onUpdateStatus(item.id, item.status)}
              disabled={loading[item.id] || itemStatus[item.id] === (item.status === 'lost' ? 'found' : 'claimed')}
              className={`w-full bg-gradient-to-r ${item.status === 'lost' ? 'from-blue-600 to-indigo-600' : 'from-green-600 to-emerald-600'} text-white py-1.5 px-3 rounded-md text-xs sm:text-sm font-medium ${loading[item.id] || itemStatus[item.id] === (item.status === 'lost' ? 'found' : 'claimed') ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
            >
              {loading[item.id] ? 'Updating...' :
               itemStatus[item.id] === (item.status === 'lost' ? 'found' : 'claimed')
               ? `Marked as ${item.status === 'lost' ? 'Found' : 'Claimed'}`
               : `Mark as ${item.status === 'lost' ? 'Found' : 'Claimed'}`}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-2">
        <button
          onClick={onNavigate}
          className={`flex-1 bg-gradient-to-r from-${colorClass}-500/60 to-purple-500/60 hover:from-${colorClass}-500/80 hover:to-purple-500/80 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 transition-all`}
        >
          <span>View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        {(item.user !== currentUser.id || item.claim_status) && (
          <button
            onClick={handleChatNavigate}
            disabled={!receiverId}
            className={`flex-1 bg-gradient-to-r from-cyan-500/60 to-blue-500/60 hover:from-cyan-500/80 hover:to-blue-500/80 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 ${!receiverId ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { notificationCount } = useNotifications();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [recentGlobalItems, setRecentGlobalItems] = useState({ lost: [], found: [] });
  const [myReportedItems, setMyReportedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [itemStatus, setItemStatus] = useState({});
  const [loading, setLoading] = useState({});

  const BASE_STATS = {
    total_lost_items: 43,
    total_found_items: 56,
    total_ai_matches: 39,
    success_ratio: 93.84,
  };

  const fetchAllData = async () => {
    try {
      setError('');
      const [dashboardData, myItemsData] = await Promise.all([getDashboardData(), getMyItems()]);
      setStats([
        { label: 'Reported Lost', value: BASE_STATS.total_lost_items + (dashboardData.total_lost_items || 0), icon: XCircle, color: 'from-red-600 to-pink-600' },
        { label: 'Reported Found', value: BASE_STATS.total_found_items + (dashboardData.total_found_items || 0), icon: CheckCircle, color: 'from-green-600 to-emerald-600' },
        { label: 'Matches', value: BASE_STATS.total_ai_matches + (dashboardData.total_ai_matches || 0), icon: Zap, color: 'from-yellow-500 to-orange-500' },
        { label: 'Success', value: `${(BASE_STATS.success_ratio + (dashboardData.success_ratio || 0)).toFixed(2)}%`, icon: TrendingUp, color: 'from-blue-600 to-indigo-600' },
      ]);
      setRecentGlobalItems({
        lost: (dashboardData.lost_items || []).filter(i => !i.is_claimed && i.status !== 'claimed'),
        found: (dashboardData.found_items || []).filter(i => !i.is_claimed && i.status !== 'claimed'),
      });
      setMyReportedItems(myItemsData.filter(i => !i.is_claimed && i.status !== 'claimed') || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { setMounted(true); fetchAllData(); }, []);

  const handleApproveClaim = async id => {
    if (!window.confirm('Approve this claim?')) return;
    try { setLoading(p => ({ ...p, [id]: true })); await approveClaim(id); await fetchAllData(); setError(''); }
    catch (e) { setError(e.response?.data?.detail || 'Failed to approve claim'); }
    finally { setLoading(p => ({ ...p, [id]: false })); }
  };

  const handleUpdateStatus = async (id, status) => {
    const newStatus = status === 'lost' ? 'found' : 'claimed';
    if (!window.confirm(`Mark as ${newStatus}?`)) return;
    try { setLoading(p => ({ ...p, [id]: true })); await updateItemStatus(id, newStatus); setItemStatus(p => ({ ...p, [id]: newStatus })); await fetchAllData(); }
    catch (e) { setError(e.response?.data?.detail || `Failed to update to ${newStatus}`); }
    finally { setLoading(p => ({ ...p, [id]: false })); }
  };

  const handleLogout = () => { logout(); navigate('/auth'); };

  const quickActions = [
    { label: 'Report Lost', icon: XCircle, route: '/report-lost', color: 'from-red-600 to-pink-600' },
    { label: 'Report Found', icon: CheckCircle, route: '/report-found', color: 'from-green-600 to-emerald-600' },
    { label: 'AI Assistant', icon: Bot, route: '/chat-assistant', color: 'from-blue-600 to-indigo-600' },
    { label: 'Matches', icon: Zap, route: '/matches', color: 'from-yellow-500 to-orange-500' },
  ];

  if (isLoading)
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-purple-950 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4 sm:px-6">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl px-6 py-3 shadow-lg shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className={`flex items-center space-x-3 transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Refind</span>
            </button>
            <div className="flex items-center">
              <div className={`hidden sm:flex items-center space-x-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full bg-slate-800/60 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300">
                  <Bell className="w-5 h-5 text-gray-300 hover:text-cyan-400" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white font-bold">{notificationCount}</span>
                  )}
                </button>
                <button onClick={() => navigate('/profile')} className="relative p-2 rounded-full bg-slate-800/60 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300">
                  <User className="w-5 h-5 text-gray-300 hover:text-cyan-400" />
                </button>
                <button onClick={handleLogout} className="bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:from-cyan-500 hover:to-purple-600 transition-all duration-300">Logout</button>
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="sm:hidden p-2 rounded-full bg-slate-800/60 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300" aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-2 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 flex flex-col space-y-2">
              <button onClick={() => { navigate('/notifications'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded-md bg-slate-800/60 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="text-white text-sm">Notifications</span>
                {notificationCount > 0 && (
                  <span className="ml-auto w-5 h-5 text-xs flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white font-bold">{notificationCount}</span>
                )}
              </button>
              <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded-md bg-slate-800/60 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300">
                <User className="w-5 h-5 text-gray-300" />
                <span className="text-white text-sm">Profile</span>
              </button>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2 rounded-md text-white text-sm font-medium transition-all duration-300">Logout</button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 max-w-6xl pt-24 pb-16">
        <div className={`text-center mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{currentUser?.name || 'User'}</span></h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">Your AI-powered lost & found dashboard</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">{error}</div>}

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((s, index) => (
            <div key={s.label} className="bg-slate-900/50 backdrop-blur-md p-4 rounded-lg border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-purple-500/20" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-md bg-gradient-to-r ${s.color}`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-gray-300">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className={`lg:col-span-1 bg-slate-900/50 backdrop-blur-md p-4 rounded-lg border border-purple-500/30 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-400 mr-3 animate-pulse" />
              <h2 className="font-semibold text-white text-lg">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((a, index) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.route)}
                  className={`w-full flex items-center p-3 bg-slate-800/50 border border-purple-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 hover:scale-102`}
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className={`p-2 rounded-md bg-gradient-to-r ${a.color} mr-3`}>
                    <a.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white hover:text-cyan-300 transition-colors duration-300">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-2 bg-slate-900/50 backdrop-blur-md p-4 rounded-lg border border-purple-500/30 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-cyan-400 mr-3 animate-pulse" />
              <h2 className="font-semibold text-white text-lg">Your Recent Activity</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {myReportedItems.length ? myReportedItems.map(i => (
                <ItemCard key={i.id} item={i} colorClass={i.status === 'lost' ? 'red' : 'green'} onNavigate={() => navigate(`/items/${i.id}`)}
                          showClaimInfo onApproveClaim={handleApproveClaim} onUpdateStatus={handleUpdateStatus} loading={loading} itemStatus={itemStatus} />
              )) : <p className="sm:col-span-2 text-center py-8 text-gray-300">No items yet.</p>}
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Search className="w-6 h-6 text-purple-400 mr-3" />Global Items Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-lg border border-red-500/30">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <XCircle className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="font-semibold text-white text-lg">Recently Lost</h3>
                </div>
                <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-bold">{recentGlobalItems.lost.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {recentGlobalItems.lost.length ? recentGlobalItems.lost.map(i => (
                  <ItemCard key={i.id} item={i} colorClass="red" onNavigate={() => navigate(`/items/${i.id}`)} />
                )) : <p className="sm:col-span-2 text-center py-8 text-gray-300">None yet.</p>}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="font-semibold text-white text-lg">Recently Found</h3>
                </div>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-bold">{recentGlobalItems.found.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {recentGlobalItems.found.length ? recentGlobalItems.found.map(i => (
                  <ItemCard key={i.id} item={i} colorClass="green" onNavigate={() => navigate(`/items/${i.id}`)} />
                )) : <p className="sm:col-span-2 text-center py-8 text-gray-300">None yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-purple-500/30 bg-slate-900/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Refind
                </span>
                <p className="text-xs text-gray-400">AI-Powered Lost & Found Solution</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-gray-400 text-sm">
              <button onClick={() => navigate('/privacy')} className="hover:text-cyan-400 transition-colors duration-300">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-cyan-400 transition-colors duration-300">Terms</button>
              <button onClick={() => navigate('/contact')} className="hover:text-cyan-400 transition-colors duration-300">Contact</button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>© 2025 Refind. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
        @media (max-width: 640px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
          }
          .grid {
            gap: 8px;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .grid {
            gap: 10px;
          }
        }
        @media (min-width: 1025px) {
          .grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;