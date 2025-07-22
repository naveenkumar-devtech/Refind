import React from "react";
import {
  Search,
  LogIn,
  Shield,
  Star,
  ChevronLeft,
  User,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-base sm:text-lg">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-80 h-48 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-80 h-48 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md shadow-purple-500/25 relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg animate-pulse"></div>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                refind
              </span>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-purple-400/40 hover:bg-slate-700/50 transition-all duration-300 group text-sm sm:text-base"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                Dashboard
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-3xl sm:max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 rounded-2xl sm:rounded-3xl shadow-md shadow-purple-500/10 border border-purple-500/20 backdrop-blur-xl overflow-hidden">
            {/* Header with avatar */}
            <div className="relative bg-gradient-to-r from-cyan-500/10 to-purple-600/10 p-4 sm:p-6 border-b border-purple-500/20">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/25">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                    {currentUser.name}
                  </h2>
                  <p className="text-purple-300 mb-1 sm:mb-2 text-sm sm:text-base">{currentUser.email}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm text-slate-400">
                        Member
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-purple-400" />
                    Personal Information
                  </h3>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2 transition-colors group-hover:text-purple-300">
                      Full Name
                    </label>
                    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-300">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{currentUser.name}</p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2 transition-colors group-hover:text-purple-300 flex items-center">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Email Address
                    </label>
                    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-300">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2 transition-colors group-hover:text-purple-300 flex items-center">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Phone Number
                    </label>
                    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-300">
                      <p className="text-white font-medium text-sm sm:text-base truncate">
                        {currentUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-purple-400" />
                    Account Details
                  </h3>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2 transition-colors group-hover:text-purple-300">
                      Student ID
                    </label>
                    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-300">
                      <p className="text-white font-medium font-mono text-sm sm:text-base truncate">
                        {currentUser.student_id}
                      </p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2 transition-colors group-hover:text-purple-300">
                      Member Since
                    </label>
                    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 group-hover:border-purple-500/30 transition-all duration-300">
                      <p className="text-white font-medium text-sm sm:text-base">Data not available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-500/20">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-slate-800/50 border border-red-500/30 text-red-400 py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-red-500/10 hover:border-red-400/50 transition-all duration-300 transform hover:scale-[1.02] font-medium flex items-center justify-center group text-sm sm:text-base"
                  >
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 rotate-180 group-hover:rotate-180 transition-transform duration-300" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/30 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Security</h4>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Your account is protected with advanced security features
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/30 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Premium</h4>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Enjoy unlimited access to all premium features
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/30 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Analytics</h4>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Track your activity and discover insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;