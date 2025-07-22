import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight, LogIn, UserPlus, User, Database, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthPage = ({ onBack }) => {
  const navigate = useNavigate();
  const { login, signup, currentUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [error, setError] = useState('');
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: '',
    phone: ''
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthInputChange = (field, value) => {
    console.log(`Updating ${field}:`, value);
    setAuthData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('authData before submission:', authData);

    try {
      if (isLogin) {
        if (!authData.email || !authData.password) {
          throw new Error('Email and password are required');
        }
        await login({ email: authData.email, password: authData.password });
      } else {
        if (!authData.email || !authData.password || !authData.name || !authData.studentId.trim()) {
          console.log('Missing or empty required fields:', {
            email: authData.email,
            password: authData.password,
            name: authData.name,
            studentId: authData.studentId
          });
          throw new Error('Name, email, password, and student ID are required');
        }
        
        const signupPayload = {
          username: authData.email.split('@')[0] + Math.floor(Math.random() * 1000),
          email: authData.email,
          password: authData.password,
          name: authData.name,
          student_id: authData.studentId,
          phone: authData.phone,
        };
        console.log('Signup payload:', signupPayload);
        await signup(signupPayload);
      }
      navigate('/dashboard');
    } catch (err) {
      const serverError = err.response?.data?.error || err.response?.data;
      let displayError = 'Authentication failed. Please check your credentials.';
      if (typeof serverError === 'object' && serverError !== null) {
        displayError = Object.entries(serverError)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' ');
      } else if (typeof serverError === 'string') {
        displayError = serverError;
      } else if (err.message) {
        displayError = err.message;
      }
      console.error('Submission error:', displayError);
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode) => {
    setIsLogin(mode);
    setError('');
    setAuthData({ email: '', password: '', name: '', studentId: '', phone: '' });
  };
  
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-cyan-400/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  const AnimatedBackground = () => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-purple-900/20 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      <div className={`max-w-md sm:max-w-lg w-full relative z-10 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="relative group bg-gradient-to-r from-slate-800/60 to-purple-900/40 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-cyan-400 hover:text-white transition-all duration-500 flex items-center mx-auto hover:scale-105 hover:shadow-md hover:shadow-cyan-500/25 overflow-hidden text-sm sm:text-base"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            <div className="relative z-10 flex items-center">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 transition-all duration-300 group-hover:translate-x-[-3px] group-hover:scale-110" />
              <span className="font-semibold tracking-wide ml-1 sm:ml-2">Back to Home</span>
            </div>
          </button>
        </div>
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-2xl flex items-center justify-center mr-2 sm:mr-3 shadow-md shadow-cyan-500/25 animate-pulse">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-500 bg-clip-text text-transparent animate-pulse">refind</h1>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mt-1 sm:mt-2 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-300 text-sm sm:text-base font-medium text-center mb-6 sm:mb-8">AI-powered item recovery system</p>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-purple-500/20 shadow-md" />
          <form onSubmit={handleAuthSubmit} className="relative z-10 p-6 sm:p-8">
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg sm:rounded-xl text-red-300 text-center text-sm sm:text-base">{error}</div>
            )}
            <div className="flex mb-6 sm:mb-8 p-1 bg-slate-800/50 rounded-lg sm:rounded-2xl backdrop-blur-sm border border-slate-700/50">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 text-center font-semibold rounded-lg sm:rounded-xl transition-all duration-500 group ${isLogin ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />Login
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 text-center font-semibold rounded-lg sm:rounded-xl ml-1 sm:ml-2 transition-all duration-500 group ${!isLogin ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />Sign Up
              </button>
            </div>
            <div className="space-y-6 sm:space-y-8">
              {!isLogin && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">Full Name</label>
                    <div className="relative">
                      <User className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 sm:left-5 top-4 sm:top-5 transition-all duration-300 ${focusedField === 'name' ? 'text-cyan-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        required
                        value={authData.name}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        onChange={(e) => handleAuthInputChange('name', e.target.value)}
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">Student ID</label>
                    <div className="relative">
                      <Database className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 sm:left-5 top-4 sm:top-5 transition-all duration-300 ${focusedField === 'studentId' ? 'text-cyan-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        required
                        value={authData.studentId}
                        onFocus={() => setFocusedField('studentId')}
                        onBlur={() => setFocusedField('')}
                        onChange={(e) => handleAuthInputChange('studentId', e.target.value)}
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400"
                        placeholder="Enter your student ID"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">Email Address</label>
                <div className="relative">
                  <Mail className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 sm:left-5 top-4 sm:top-5 transition-all duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    required
                    value={authData.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => handleAuthInputChange('email', e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">Password</label>
                <div className="relative">
                  <Lock className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 sm:left-5 top-4 sm:top-5 transition-all duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authData.password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => handleAuthInputChange('password', e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 sm:right-5 top-4 sm:top-5 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">Phone Number <span className="text-gray-500">(Optional)</span></label>
                  <div className="relative">
                    <User className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 sm:left-5 top-4 sm:top-5 transition-all duration-300 ${focusedField === 'phone' ? 'text-cyan-400' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      value={authData.phone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      onChange={(e) => handleAuthInputChange('phone', e.target.value)}
                      className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {isLogin ? (
                      <>
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        Create Account
                      </>
                    )}
                  </div>
                )}
              </button>
              <div className="text-center mt-3 sm:mt-4">
                <p className="text-gray-400 text-xs sm:text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => switchMode(!isLogin)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;