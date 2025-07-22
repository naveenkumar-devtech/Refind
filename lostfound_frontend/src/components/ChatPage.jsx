import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Changed to useSearchParams
import { useAuth } from '../context/AuthContext';
import { getChatMessages, sendChatMessage, getItemDetails } from '../services/api';
import { ArrowLeft, Send, RefreshCw } from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Changed to useSearchParams
  const { currentUser } = useAuth();

  const itemId = searchParams.get('item_id'); // Get item_id from query params
  const receiverId = searchParams.get('receiver_id'); // Get receiver_id from query params

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [item, setItem] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log('Search params:', Object.fromEntries(searchParams)); // Debug query params
    if (!currentUser) {
      console.log('No current user, redirecting to /auth');
      navigate('/auth');
      return;
    }

    // Validate that itemId and receiverId are numeric
    if (!itemId || !receiverId || isNaN(itemId) || isNaN(receiverId)) {
      setError('Invalid chat session: item ID or receiver ID is missing or invalid.');
      console.error('Invalid item_id or receiver_id:', { itemId, receiverId });
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const [chatHistory, itemData] = await Promise.all([
          getChatMessages(itemId, receiverId),
          getItemDetails(itemId),
        ]);
        if (isMounted) {
          setMessages(currentMessages => {
            if (JSON.stringify(currentMessages) !== JSON.stringify(chatHistory)) {
              return chatHistory;
            }
            return currentMessages;
          });
          setItem(itemData.data); // Adjust for axios response structure
          console.log('Chat loaded:', { itemId, receiverId, messages: chatHistory, item: itemData.data });
        }
      } catch (err) {
        if (isMounted) {
          let errorMessage = 'Could not load chat history or item details.';
          if (err.message.includes('401')) {
            errorMessage = 'Authentication failed. Please log in again.';
            navigate('/auth');
          } else if (err.message.includes('404')) {
            errorMessage = 'Item or chat not found.';
          } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          }
          setError(errorMessage);
          console.error('Error loading chat:', {
            message: err.message,
            response: err.response?.data,
            itemId,
            receiverId,
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      if (isMounted && itemId && receiverId && !isNaN(itemId) && !isNaN(receiverId)) {
        fetchData();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [itemId, receiverId, currentUser, navigate, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !itemId || !receiverId || isNaN(itemId) || isNaN(receiverId) || isSending) return;

    const messageText = input;
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const newMessage = await sendChatMessage(itemId, receiverId, messageText);
      setMessages((prev) => [...prev, newMessage]);
      console.log('Message sent:', newMessage);
    } catch (err) {
      let errorMessage = 'Failed to send message. Please try again.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      setError(errorMessage);
      setInput(messageText);
      console.error('Error sending message:', {
        message: err.message,
        response: err.response?.data,
        itemId,
        receiverId,
        messageText,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <div className="bg-slate-800/50 p-4 rounded-t-2xl border-b border-purple-500/30 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-bold text-white">
            Chat about Item #{itemId}
            {item && ` (${item.title}, ${item.status})`}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-xl m-4 text-center flex items-center justify-between">
            <span>{error}</span>
            {error.includes('Failed to send') && (
              <button
                onClick={handleSend}
                className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                disabled={isSending}
              >
                <RefreshCw className="w-4 h-4 inline mr-1" /> Retry
              </button>
            )}
          </div>
        )}

        <div className="flex-grow h-96 overflow-y-auto p-4 space-y-4 bg-slate-900/30">
          {isLoading ? (
            <div className="text-center text-white pt-16">Loading Chat...</div>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={`${msg.id}-${index}`}
                className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg ${
                    msg.sender === currentUser.id
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-slate-400 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 pt-16">No messages yet. Start the conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-800/80 rounded-b-2xl">
          <div className="flex space-x-3">
            <input
              type="text"
              className="w-full bg-slate-700/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white disabled:opacity-50"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSending) handleSend();
              }}
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className={`bg-purple-600 p-3 rounded-xl font-medium flex items-center justify-center transition-colors ${
                isSending || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              } text-white`}
            >
              <Send className={`w-6 h-6 ${isSending ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;