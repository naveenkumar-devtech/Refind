import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItemDetails } from '../services/api';
import { ArrowLeft, Clock, MapPin, MessageSquare } from 'lucide-react';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            setIsLoading(true);
            try {
                const data = await getItemDetails(itemId);
                setItem(data);
            } catch (err) {
                setError('Failed to fetch item details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [itemId]);

    const handleStartChat = () => {
        // The backend sends the user ID in the 'user' field from the ItemSerializer
        navigate(`/chat?item_id=${item.id}&receiver_id=${item.user}`);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">{error}</div>;
    if (!item) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Item not found.</div>;

    // The user who reported the item
    const isOwner = item.user === currentUser.id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-auto object-cover rounded-2xl shadow-2xl shadow-purple-500/20" />
                        ) : (
                            <div className="w-full h-96 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">No Image Provided</div>
                        )}
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-purple-500/20 flex flex-col">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${item.status === 'lost' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                            Status: {item.status}
                        </span>
                        
                        <h1 className="text-4xl font-bold text-white mt-4">{item.title}</h1>
                        
                        <div className="flex items-center space-x-4 text-slate-400 mt-2">
                            <div className="flex items-center space-x-2"><MapPin className="w-4 h-4" /><span>{item.location}</span></div>
                        </div>
                        
                        <p className="text-slate-300 mt-6 leading-relaxed flex-grow">{item.description}</p>
                        
                        {/* Show the chat button only if the current user did NOT report the item */}
                        {!isOwner && (
                            <div className="mt-8 border-t border-slate-700 pt-6">
                                <button 
                                    onClick={handleStartChat}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center justify-center space-x-3"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>Chat with User to Verify</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;