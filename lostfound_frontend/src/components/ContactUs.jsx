import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    // Mock submission for frontend testing
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
      alert("Thank you for your inquiry! Our team will respond soon.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4 sm:px-6">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl px-6 py-3 shadow-lg shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Refind
              </span>
            </Link>
            <div className="flex items-center">
              <nav className="hidden sm:flex items-center space-x-6">
                <Link to="/" className="text-sm font-medium hover:text-cyan-400 transition-colors duration-300 relative group">
                  Home
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/privacy" className="text-sm font-medium hover:text-cyan-400 transition-colors duration-300 relative group">
                  Privacy
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/terms" className="text-sm font-medium hover:text-cyan-400 transition-colors duration-300 relative group">
                  Terms
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/contact" className="text-sm font-medium hover:text-cyan-400 transition-colors duration-300 relative group">
                  Contact
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </nav>
              <button
                className="sm:hidden text-white hover:text-cyan-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="sm:hidden mt-2 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 flex flex-col space-y-2">
              <Link to="/" className="text-sm hover:text-cyan-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/privacy" className="text-sm hover:text-cyan-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Privacy
              </Link>
              <Link to="/terms" className="text-sm hover:text-cyan-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Terms
              </Link>
              <Link to="/contact" className="text-sm hover:text-cyan-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className={`text-center mb-12 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Contact <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Refind</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
              Reach out with questions, feedback, or support inquiries. Our team is here to assist you with Refind’s AI-powered lost and found solution.
            </p>
          </div>

          <div className={`flex justify-center transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-500 max-w-md w-full shadow-xl shadow-purple-500/20">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full p-3 bg-slate-800/50 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    className="w-full p-3 bg-slate-800/50 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message"
                    rows="4"
                    className="w-full p-3 bg-slate-800/50 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-sm sm:text-base font-medium px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
              <p className="text-gray-300 text-sm sm:text-base text-center mt-4">
                Prefer email? Reach us at{" "}
                <a href="mailto:refindaiapp@gmail.com" className="text-cyan-400 hover:underline">
                  refindaiapp@gmail.com
                </a>
              </p>
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
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors duration-300">Privacy</Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors duration-300">Terms</Link>
              <Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300">Contact</Link>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>© 2025 Refind. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;