import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { getCategories } from '../services/api';
import { Search, MapPin, Clock, Upload, Camera, X, Gift, Lock, Eye, EyeOff } from 'lucide-react';

const ReportFound = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { addFoundItem } = useItems();

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
    payload.append('status', 'found');
    payload.append('category', formData.category);
    payload.append('private_note', formData.privateNote);
    if (formData.image) {
      payload.append('image', formData.image, formData.image.name);
    }

    try {
      await addFoundItem(payload);
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to report found item:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-32 -right-20 sm:-right-32 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-32 -left-20 sm:-left-32 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-br from-green-500/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-green-500/20 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-md shadow-green-500/25">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                refind
              </span>
            </div>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700 hover:border-emerald-400/50 hover:text-emerald-400 transition-all duration-300 hover:shadow-md hover:shadow-emerald-400/20 text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 bg-clip-text text-transparent animate-gradient">
            Report Found Item
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
            <p className="text-base sm:text-lg">Be someone's hero - help reunite them with their lost item</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl sm:max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/60 to-green-900/40 rounded-2xl sm:rounded-3xl shadow-md p-6 sm:p-8 border border-green-500/30 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl sm:rounded-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 group-focus-within:text-emerald-400 transition-colors">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-slate-700/70 text-sm sm:text-base"
                    placeholder="What did you find?"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 group-focus-within:text-emerald-400 transition-colors">
                    Location Found *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2 sm:left-3 top-2.5 sm:top-3 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-slate-700/70 text-sm sm:text-base"
                      placeholder="Where did you find it?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 group-focus-within:text-emerald-400 transition-colors">
                      Date Found *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2 sm:left-3 top-2.5 sm:top-3 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-white transition-all duration-300 hover:bg-slate-700/70 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 group-focus-within:text-emerald-400 transition-colors">
                      Category *
                    </label>
                    <select
                      required
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-white transition-all duration-300 hover:bg-slate-700/70 text-sm sm:text-base"
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 group-focus-within:text-emerald-400 transition-colors">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-slate-700/70 resize-none text-sm sm:text-base"
                    placeholder="Provide detailed description..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Photo Upload
                  </label>
                  <div className="relative">
                    {!uploadedImage ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 sm:h-48 border-2 border-dashed border-slate-600 rounded-lg sm:rounded-xl bg-slate-700/30 hover:border-emerald-400/50 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300 mb-2 sm:mb-3" />
                        <p className="text-gray-400 group-hover:text-emerald-400 transition-colors duration-300 text-center text-sm sm:text-base">
                          Click to upload photo
                        </p>
                      </div>
                    ) : (
                      <div className="relative w-full h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden group shadow-md">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded item" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full transition-colors duration-300 shadow-md"
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
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center space-x-1 sm:space-x-2">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Private Note</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPrivateNote(!showPrivateNote)}
                      className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full bg-slate-700/50 hover:bg-slate-700/70"
                    >
                      {showPrivateNote ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span>{showPrivateNote ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className={`transition-all duration-500 overflow-hidden ${showPrivateNote ? 'max-h-28 sm:max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <textarea
                      value={formData.privateNote}
                      onChange={(e) => handleInputChange('privateNote', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 text-white placeholder-gray-400 transition-all duration-300 hover:bg-slate-700/70 resize-none text-sm sm:text-base"
                      placeholder="Your contact info, safe location details, etc."
                      rows="3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-md hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 font-medium text-base sm:text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base">Submitting Report...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                        <span>Submit Report</span>
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

export default ReportFound;