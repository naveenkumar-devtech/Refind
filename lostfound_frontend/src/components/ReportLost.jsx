import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { getCategories } from '../services/api';
import { Search, MapPin, Clock, Upload, Camera, X, Heart, Sparkles, FileImage, Lock, Eye, EyeOff } from 'lucide-react';

const ReportLost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { addLostItem } = useItems();

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    privateNote: '',
    image: null
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPrivateNote, setShowPrivateNote] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
            setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('location', formData.location);
    payload.append('status', 'lost');
    payload.append('category', formData.category);
    payload.append('private_note', formData.privateNote);
    if (formData.image) {
      payload.append('image', formData.image, formData.image.name);
    }

    try {
      await addLostItem(payload);
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to report lost item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        handleInputChange('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    handleInputChange('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-red-500/20 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-orange-500/15 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-xl border-b border-red-500/30 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-md shadow-red-500/25">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                refind
              </span>
            </div>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-800/80 to-red-900/50 border border-red-500/30 hover:border-red-400/70 hover:shadow-md hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
            >
              <span className="bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent font-medium">
                Back to Dashboard
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 animate-pulse mr-2 sm:mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
              Report Lost Item
            </h1>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 animate-pulse ml-2 sm:ml-3" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl sm:max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/90 via-red-950/80 to-gray-900/90 rounded-2xl sm:rounded-3xl shadow-md p-6 sm:p-8 border border-red-500/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-pink-500/5 to-orange-500/8 rounded-2xl sm:rounded-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6 sm:space-y-8">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 group-focus-within:text-red-300 transition-colors duration-300 flex items-center space-x-2">
                    <span>Item Title</span><span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/60 border border-red-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 backdrop-blur-sm text-sm sm:text-base"
                    placeholder="What precious item did you lose?"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 group-focus-within:text-red-300 transition-colors duration-300 flex items-center space-x-2">
                    <span>Location Lost</span><span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 absolute left-3 sm:left-4 top-3 sm:top-4 group-focus-within:text-red-300 transition-colors duration-300" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 bg-gray-800/60 border border-red-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Where did you last see it?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 group-focus-within:text-red-300 transition-colors duration-300 flex items-center space-x-2">
                      <span>Date Lost</span><span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 absolute left-3 sm:left-4 top-3 sm:top-4 group-focus-within:text-red-300 transition-colors duration-300" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 bg-gray-800/60 border border-red-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 text-white transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 backdrop-blur-sm text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 group-focus-within:text-red-300 transition-colors duration-300 flex items-center space-x-2">
                      <span>Category</span><span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/60 border border-red-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 text-white transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 backdrop-blur-sm text-sm sm:text-base"
                    >
                      <option value="">Select category...</option>
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading categories...</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 group-focus-within:text-red-300 transition-colors duration-300 flex items-center space-x-2">
                    <span>Detailed Description</span><span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/60 border border-red-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 resize-none backdrop-blur-sm text-sm sm:text-base"
                    placeholder="Paint a vivid picture..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 sm:mb-3 flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-red-400" />
                    <span>Photo Upload</span>
                    <span className="text-xs text-gray-400 font-normal">(Highly Recommended)</span>
                  </label>
                  <div className="relative">
                    {!uploadedImage ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 sm:h-56 border-2 border-dashed border-red-500/40 rounded-lg sm:rounded-2xl bg-gradient-to-br from-gray-800/40 to-red-900/20 hover:border-red-400/70 hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-red-900/40 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center transform group-hover:scale-105 transition-transform duration-300">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-md shadow-red-500/25">
                            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <p className="text-gray-200 group-hover:text-red-200 transition-colors duration-300 text-center font-medium text-sm sm:text-base">
                            Upload a photo of your item
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 sm:h-56 rounded-lg sm:rounded-2xl overflow-hidden group shadow-md">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded item" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md shadow-red-500/25"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="text-xs sm:text-sm font-semibold text-gray-200 flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-pink-400" />
                      <span>Claim Note</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPrivateNote(!showPrivateNote)}
                      className="text-xs sm:text-sm text-red-300 hover:text-red-200 transition-colors duration-300 flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                    >
                      {showPrivateNote ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPrivateNote ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className={`transition-all duration-700 overflow-hidden ${showPrivateNote ? 'max-h-32 sm:max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <textarea
                      value={formData.privateNote}
                      onChange={(e) => handleInputChange('privateNote', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/60 border border-pink-500/30 rounded-lg sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:border-pink-400/50 resize-none backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Personal notes, contact preferences, reward details..."
                      rows="3"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-2xl hover:shadow-md hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 font-bold text-base sm:text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                        <span className="animate-pulse text-sm sm:text-base">Submitting Your Report...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                        <span>Submit Lost Item Report</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;