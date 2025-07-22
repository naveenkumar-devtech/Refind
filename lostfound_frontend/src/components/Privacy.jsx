import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Zap, Menu } from "lucide-react";

const Privacy = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ left: '20%', top: '30%' }} />
        <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>

      <header className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl transition-all duration-500">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-purple-500/20 rounded-lg sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-md shadow-purple-500/10">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md shadow-purple-500/25">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                refind
              </span>
            </Link>
            <div className="flex items-center">
              <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 md:space-x-8 ml-4 sm:ml-6 whitespace-nowrap">
                <Link to="/" className="relative group hover:text-cyan-400 transition-all duration-300 text-sm sm:text-base">
                  Home
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/terms" className="relative group hover:text-cyan-400 transition-all duration-300 text-sm sm:text-base">
                  Terms
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/contact" className="relative group hover:text-cyan-400 transition-all duration-300 text-sm sm:text-base">
                  Contact Us
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </nav>
              <button
                className="sm:hidden text-white hover:text-cyan-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="sm:hidden mt-2 bg-slate-900/90 backdrop-blur-md border border-purple-500/20 rounded-lg p-4 flex flex-col space-y-2">
              <Link
                to="/"
                className="text-sm hover:text-cyan-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/terms"
                className="text-sm hover:text-cyan-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="text-sm hover:text-cyan-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
                Privacy{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  Policy
                </span>
              </h1>
              <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl">
                <div className="relative">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 animate-pulse" />
                </div>
                <span className="text-cyan-300 font-medium text-sm sm:text-base">We value your privacy</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>

            <div className={`space-y-8 sm:space-y-10 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <section className="group bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-md hover:shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">Introduction</h2>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  At Refind, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform to report or find lost items.
                </p>
              </section>
              <section className="group bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-md hover:shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">Information We Collect</h2>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  We collect:
                </p>
                <ul className="list-disc pl-4 sm:pl-6 text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>Personal information (e.g., name, email) when you register or contact us.</li>
                  <li>Item details (e.g., descriptions, photos, locations) for lost/found reports.</li>
                  <li>Usage data (e.g., IP address, browser type) for analytics.</li>
                </ul>
              </section>
              <section className="group bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-md hover:shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  Your data is used to:
                </p>
                <ul className="list-disc pl-4 sm:pl-6 text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>Match lost and found items using AI algorithms.</li>
                  <li>Send notifications about potential matches.</li>
                  <li>Improve our services and user experience.</li>
                </ul>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base mt-2 sm:mt-4">
                  <strong>Data Protection:</strong> We use end-to-end encryption and secure servers to protect your data. We do not share your personal information with third parties except as required by law.
                </p>
              </section>
              <section className="group bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-md hover:shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">Your Rights</h2>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  You can access, update, or delete your account data by contacting us at <a href="mailto:refindaiapp@gmail.com" className="text-cyan-400 hover:underline">refindaiapp@gmail.com</a>.
                </p>
              </section>
              <section className="group bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-md hover:shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">Changes to This Policy</h2>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  We may update this policy periodically. Check this page for the latest version.
                </p>
              </section>
              <p className="text-center text-gray-400 text-xs sm:text-sm">Last updated: June 30, 2025</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 sm:py-12 border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between space-y-6 sm:space-y-8 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block">
                  refind
                </span>
                <span className="text-xs sm:text-sm text-gray-400">Powered by AI</span>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 text-gray-400">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link to="/terms" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Terms
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Contact Us
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm">© 2025 refind. All rights reserved.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
      </footer>
    </div>
  );
};

export default Privacy;