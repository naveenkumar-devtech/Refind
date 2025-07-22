import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Zap, MapPin, Shield, Menu, X, ArrowRight, Star, Sparkles, Globe, Users, Award, ChevronDown } from "lucide-react";

const LandingPage = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "AI Powered Search",
      description: "Advanced AI algorithms to match lost items with found ones using smart descriptions and image recognition.",
      color: "from-cyan-400 to-blue-500",
      delay: "0ms"
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Quantum Location",
      description: "Precision mapping with AR integration and real-time location clustering for instant proximity alerts.",
      color: "from-purple-400 to-pink-500",
      delay: "100ms"
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Lightning Match",
      description: "Sub-second matching with push notifications and smart priority queuing for urgent recoveries.",
      color: "from-orange-400 to-red-500",
      delay: "200ms"
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Zero-Trust Security",
      description: "Your personal information is protected with end-to-end encryption and privacy-first approach.",
      color: "from-green-400 to-emerald-500",
      delay: "300ms"
    },
  ];

  const stats = [
    { number: "AI", label: "Powered Search", icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "24/7", label: "Available", icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "Free", label: "To Start", icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "Safe", label: "& Secure", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      role: "College Student",
      content: "Refind’s AI makes it easy to report lost items and connect with finders securely. A game-changer for campus life!",
      avatar: "RG",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Marketing Professional",
      content: "The platform’s intuitive design and secure messaging give me confidence to recover lost belongings quickly.",
      avatar: "RS",
      rating: 4
    },
    {
      name: "Vikram Singh",
      role: "Frequent Traveler",
      content: "Refind’s AI matching and clear interface would make recovering lost items at airports or stations so much simpler.",
      avatar: "AB",  
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 20,
            top: mousePosition.y / 20,
            transform: `translate(-50%, -50%)`,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl sm:max-w-6xl px-4 sm:px-6">
        <div className={`flex items-center justify-between w-full transition-all duration-500 ${scrollY > 50 ? 'bg-slate-900/80 backdrop-blur-2xl border border-purple-500/20 rounded-lg sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-md shadow-purple-500/10' : 'bg-transparent'}`}>
          {/* Logo Section */}
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

          {/* Desktop Nav Buttons */}
          <div className="hidden sm:flex items-center space-x-4 sm:space-x-6 md:space-x-8 ml-4 sm:ml-6">
            {['Features', 'How it Works', 'Testimonials', 'About'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="relative group hover:text-cyan-400 transition-all duration-300 text-sm sm:text-base"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={onStart}
              className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-md hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center space-x-2 text-sm sm:text-base">
                <span>Get Started</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-2 bg-slate-900/95 backdrop-blur-md border border-purple-500/20 rounded-lg p-4 shadow-md">
            <div className="space-y-2">
              {['Features', 'How it Works', 'Testimonials', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="block w-full text-left hover:text-cyan-400 transition-colors py-2 text-sm"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={onStart}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-lg hover:shadow-md hover:shadow-purple-500/25 transition-all text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <section ref={heroRef} className="min-h-[80vh] sm:min-h-screen flex items-center justify-center relative pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto">
            <div className={`mb-4 sm:mb-6 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl">
                <div className="relative">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 animate-pulse" />
                </div>
                <span className="text-cyan-300 font-medium text-sm sm:text-base">AI-Powered • Real-time • Secure</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Never Lose
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  Anything
                </span>
                <div className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-30 blur-sm" />
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl">Again</span>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Revolutionary AI-powered platform designed to unite you with <span className="text-cyan-400 font-semibold">Your Lost Belongings</span>, 
              <span className="text-purple-400 font-semibold"> Smart Matching</span>, 
              <span className="text-pink-400 font-semibold"> Instant Notifications</span> and Community Driven Recovery
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button
                onClick={onStart}
                className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold hover:shadow-md hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center space-x-2 sm:space-x-3">
                  <span>Start Finding</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl sm:max-w-3xl mx-auto transform transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="group text-center p-4 sm:p-6 rounded-lg sm:rounded-2xl bg-gradient-to-br from-slate-800/30 to-purple-900/20 border border-purple-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>
      </section>

      <section id="features" ref={featuresRef} className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              Powered by{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Future Tech
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of lost and found with cutting-edge AI and quantum-speed matching
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-md hover:shadow-purple-500/20 overflow-hidden"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                  {feature.icon}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  {feature.description}
                </p>

                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-24 relative bg-gradient-to-r from-slate-900/30 to-purple-900/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                refind
              </span>{" "}
              Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto">
              Three simple steps powered by advanced AI to reunite you with your belongings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Smart Report",
                description: "Upload photos and describe your item. Our AI instantly analyzes visual patterns, colors, and contextual details with machine learning precision.",
                icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
                color: "from-cyan-400 to-blue-500"
              },
              {
                step: "02", 
                title: "Neural Matching",
                description: "Advanced algorithms scan our global database using quantum-speed processing to find potential matches and notify you instantly.",
                icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
                color: "from-purple-400 to-pink-500"
              },
              {
                step: "03",
                title: "Secure Reunion",
                description: "Connect with verified finders through our encrypted platform and arrange safe, trackable pickup with built-in safety protocols.",
                icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
                color: "from-green-400 to-emerald-500"
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center group">
                {index < 2 && (
                  <div className="hidden sm:block absolute top-12 sm:top-16 left-full w-full z-0">
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 transform -translate-y-1/2" />
                      <ArrowRight className="absolute top-1/2 right-4 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-purple-400 transform -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-xl sm:text-2xl font-black mb-4 sm:mb-6 mx-auto shadow-md group-hover:scale-110 transition-all duration-300`}>
                  <span className="relative z-10">{step.step}</span>
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                </div>

                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${step.color} rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {step.icon}
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-cyan-300 transition-colors">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              Success{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto">
              Real people, real recoveries, real results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  refind
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto">
                The future of lost and found technology is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  We believe that losing something valuable shouldn't mean losing it forever. refind harnesses the power of artificial intelligence, machine learning, and community collaboration to create the world's most advanced lost and found ecosystem.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Our mission is revolutionary: to eliminate the frustration of lost belongings through cutting-edge technology, verified community networks, and seamless user experiences that feel like magic.
                </p>
                
                <div className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-slate-800/50 to-purple-900/30 rounded-lg sm:rounded-2xl border border-purple-500/20">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">AI-First Innovation</h4>
                    <p className="text-gray-300 text-sm sm:text-base">Next-generation neural networks with quantum-speed processing</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-500/20 shadow-md">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Why Choose refind?
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      title: "Quantum AI Matching",
                      description: "Advanced neural networks that understand context, patterns, and visual similarity",
                      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    },
                    {
                      title: "Global Community",
                      description: "Verified network of helpful people across 120+ cities worldwide",
                      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                    },
                    {
                      title: "Military-Grade Security",
                      description: "Zero-trust architecture with blockchain verification and encrypted communications",
                      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 group-hover:text-gray-200 transition-colors text-sm sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Privacy
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Terms
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Contact Us
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link to="/developers" className="hover:text-cyan-400 transition-colors duration-300 relative group text-xs sm:text-sm">
                  Developers
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

export default LandingPage;