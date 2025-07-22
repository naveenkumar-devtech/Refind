import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Mail, Linkedin } from "lucide-react";
import developerImage from "../assets/Developer_image.png"; // Import the local image

const Developers = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const developer = {
    name: "Naveen Kumar",
    role: "Lead Developer, Refind",
    contribution: "Architected Refind’s full-stack platform, integrating AI-powered matching and secure user verification.",
    github: "https://github.com/naveenkumar-devtech/",
    linkedin: "https://www.linkedin.com/in/naveen-kumar-684a19305/",
    email: "mailto:naveentyut@gmail.com",
    profilePicture: developerImage, // Use the imported image
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
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
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className={`text-center mb-12 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Meet the <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Developer</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
              The driving force behind Refind, delivering an innovative AI-powered platform for lost and found item recovery.
            </p>
          </div>

          <div className={`flex justify-center transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-500 max-w-md w-full shadow-xl shadow-purple-500/20">
              <div className="flex flex-col items-center">
                <img
                  src={developer.profilePicture}
                  alt={`${developer.name} profile`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 object-cover border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300"
                />
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">{developer.name}</h2>
                <p className="text-cyan-400 text-sm sm:text-base mb-3">{developer.role}</p>
                <p className="text-gray-300 text-sm sm:text-base text-center mb-4">{developer.contribution}</p>
                <div className="flex space-x-4">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                  <a
                    href={developer.email}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                </div>
                <a
                  href={developer.email}
                  className="mt-4 inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-sm sm:text-base font-medium px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
                >
                  Connect for Collaboration
                </a>
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

export default Developers;