import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { askChatbot } from "../services/api"; // Import our new API function

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist you with Refind today? You can ask about reporting items, how the app works, or anything else.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Also scroll when typing indicator appears

  // This is the new, API-driven send handler
  const handleSend = async (optionalMessage) => {
    const userInput = optionalMessage || input.trim();
    if (!userInput || isTyping) return; // Prevent sending while bot is typing

    // 1. Add the user's message to the chat immediately
    const userMessage = { text: userInput, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // 2. Show a "typing" indicator while we wait for the API
    setIsTyping(true);

    try {
      // 3. Call the backend API
      const response = await askChatbot(userInput);
      
      // 4. Create the bot's response message
      const botMessage = {
        text: response.message,
        sender: "bot"
      };
      
      // 5. Add the bot's message to the chat
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle potential errors from the API call
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // 6. Hide the "typing" indicator
      setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-4`}>
      {/* Custom CSS for animations (retained from original) */}
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); } 50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className={`max-w-2xl mx-auto animate-fade-in`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-violet-500/30 to-fuchsia-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-glow-pulse"></div>
              <div className="relative flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-slate-900/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl border border-cyan-500/30 hover:border-fuchsia-400/50 transition-all duration-300 animate-float">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  refind AI
                </div>
              </div>
            </div>
          </div>
          <p className="text-cyan-200 text-sm animate-fade-in font-medium">
            Your AI-Powered Lost & Found Assistant
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden animate-float">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm p-4 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Support Chat
              </h2>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 bg-cyan-400/10 px-3 py-1 rounded-full hover:bg-cyan-400/20"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="grid grid-cols-2 gap-4">
              {[
                { text: "🧳 How to report lost?", message: "How do I report a lost item?" },
                { text: "🎒 How to report found?", message: "How do I report a found item?" },
                { text: "❓ How does matching work?", message: "How does the AI matching work?" },
                { text: "📧 How to contact support?", message: "How do I contact support?" },
              ].map((btn, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(btn.message)}
                  className={`w-full text-left bg-gradient-to-r from-slate-700 hover:from-slate-600 to-slate-800 hover:to-slate-700 text-white font-medium px-5 py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/30 to-indigo-900/30 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-800/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg ${msg.sender === "bot" ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/40 text-cyan-50" : "bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 border border-fuchsia-400/40 text-fuchsia-50"} backdrop-blur-sm`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/40 text-cyan-50">
                  <p className="text-sm leading-relaxed animate-pulse">Bot is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-r from-slate-800/60 to-indigo-900/60 backdrop-blur-sm">
            <div className="flex space-x-3">
              <input
                type="text"
                className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-600/60 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-200"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                disabled={isTyping} // Disable input while bot is typing
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping}
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;