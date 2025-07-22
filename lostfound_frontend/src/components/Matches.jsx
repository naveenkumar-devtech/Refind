import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Users, Star, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAIMatches } from '../services/api';

const Matches = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await getAIMatches({ query: searchQuery, location });
      console.log('AI matches fetched:', response);
      response.forEach(match => {
        console.log(`Match ID: ${match.match_item_id}, Owner ID: ${match.details.owner_id}`);
      });
      setMatches(response);
    } catch (err) {
      console.error('Error fetching AI matches:', err);
      if (err.response?.status === 429) {
        const waitTime = err.response.data.detail?.match(/\d+/) || ['a few'];
        setError(`Too many requests. Please try again in ${Math.ceil(waitTime[0] / 60)} minutes.`);
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch matches');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactFinder = (match) => {
    if (!match.match_item_id || !match.details.owner_id) {
      console.error('Missing match_item_id or owner_id for match:', match);
      setError('Unable to contact finder: missing item or owner information');
      return;
    }
    if (match.details.owner_id === currentUser?.id) {
      console.error('Cannot contact yourself:', match);
      setError('You cannot contact yourself for this item.');
      return;
    }
    console.log(`Navigating to chat with item_id: ${match.match_item_id} receiver_id: ${match.details.owner_id}`);
    navigate(`/chat?item_id=${match.match_item_id}&receiver_id=${match.details.owner_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                refind
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 hover:text-cyan-400 transition-all duration-300 hover:scale-105 bg-slate-800/50 px-4 py-2 rounded-lg border border-purple-500/20 hover:border-cyan-400/50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Item Matches
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Users className="w-5 h-5" />
            <span className="text-lg">
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} Found
            </span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your lost item (e.g., blue bag nice kota)"
              className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g., Kota)"
              className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Search className="w-6 h-6 text-white" />}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </form>

        <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 rounded-3xl shadow-2xl p-8 border border-purple-500/30 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-300">Searching for Matches...</h3>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-300">No Matches Yet</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Enter a description and location above to find potential matches for your lost item.
              </p>
              <div className="mt-8">
                <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {matches.map((match, index) => (
                <div
                  key={match.match_item_id}
                  className="group bg-gradient-to-r from-slate-700/60 to-slate-800/60 p-6 rounded-2xl border border-purple-500/20 hover:border-cyan-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 animate-fade-in-up backdrop-blur-sm"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          Match #{match.match_item_id}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Just now</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        match.score >= 0.8
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                          : match.score >= 0.6
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {(match.score * 100).toFixed(0)}% Match
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Title Hint</span>
                        <span className="text-white font-medium">{match.details.title_hint}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Location Hint</span>
                        <span className="text-white font-medium">{match.details.location_hint}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Description Hint</span>
                        <span className="text-white font-medium">{match.details.description_hint}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Confidence Score</span>
                        <span className="text-white font-medium">{(match.score * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${match.score * 100}%`,
                            animationDelay: `${0.5 + index * 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleContactFinder(match)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 px-6 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 group-hover:from-cyan-400 group-hover:to-purple-500"
                    disabled={loading}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Finder</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {matches.length > 0 && (
          <div className="fixed bottom-8 right-8 animate-bounce">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Matches;