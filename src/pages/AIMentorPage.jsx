import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Sparkles,
  User,
  GraduationCap,
  ChevronRight,
  Brain,
  PlusCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';
import api from '../services/api';
import { useRoadmap } from '../context/RoadmapContext';

const SUGGESTIONS = [
  "Explain the Virtual DOM in simple terms",
  "How do I optimize Tailwind CSS v4 builds?",
  "What is active recall and how do I practice it?",
  "What is the difference between useMemo and useCallback?"
];

export default function AIMentorPage() {
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  const fetchChatHistory = async () => {
    if (!roadmap) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/chats', {
        params: { goalId: roadmap.id }
      });
      if (response.success && response.chat) {
        setMessages(response.chat.messages);
      }
    } catch (err) {
      console.warn("Failed to load chat history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [roadmap]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || !roadmap) return;

    // 1. Add User Message to state for immediate feedback
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await api.post('/chats', {
        goalId: roadmap.id,
        message: textToSend
      });

      if (response.success && response.chat) {
        setMessages(response.chat.messages);
      }
    } catch (err) {
      console.error(err);
      // Append fallback error notification message
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-err",
        role: 'model',
        content: "Sorry, I ran into a connection error while trying to generate a response. Please check your credentials or API parameters.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  if (!roadmap) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        <SEO title="AI Study Tutor" description="Get custom concepts explained and coding summaries generated." />
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">AI Study Tutor 🧠</h1>
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs flex gap-3 items-start">
          <AlertTriangle className="shrink-0 mt-0.5" size={16} />
          <div className="space-y-1">
            <p className="font-bold">Active Learning Roadmap Required</p>
            <p className="text-muted leading-relaxed">
              Please setup an active study goal to unlock your context-aware AI Study Mentor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] flex gap-6 overflow-hidden relative animate-in fade-in duration-300">
      <SEO title="AI Mentor Chat" description="Query your personal study tutor agent, get concepts explained, and trigger recall reviews." />

      {/* Right Chat Box Area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-border/50 glass overflow-hidden relative">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-border/40 bg-background/35 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm shadow-primary/20">
              <Brain size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display leading-none">AI Study Mentor</h3>
              <span className="text-[10px] text-muted flex items-center gap-1 mt-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Learning Agent (Goal: {roadmap.goal})
              </span>
            </div>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-10 space-y-2">
              <RefreshCw className="animate-spin text-primary mx-auto" />
              <p className="text-xs text-muted">Retrieving conversation history...</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMentor = msg.role === 'model';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${isMentor ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                >
                  <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs
                    ${isMentor
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-secondary/10 text-secondary border-secondary/20'
                    }
                  `}>
                    {isMentor ? <Brain size={14} /> : <User size={14} />}
                  </div>

                  <div className="space-y-1">
                    <div className={`
                      p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed whitespace-pre-line
                      ${isMentor
                        ? 'bg-card text-foreground border-border'
                        : 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                      }
                    `}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-muted block px-1">
                      {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Brain size={14} />
              </div>
              <div className="p-3 rounded-2xl border border-border bg-card flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips & Input */}
        <div className="p-4 border-t border-border/40 bg-background/25 space-y-4 shrink-0">
          {/* Suggestion chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-card/65 text-[10px] text-muted hover:text-foreground hover:bg-card hover:border-primary/20 transition-all font-semibold"
              >
                <HelpCircle size={11} className="text-primary" />
                <span>{sug}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 relative items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI Mentor a question..."
              className="w-full rounded-xl border border-border bg-card/45 pl-4 pr-12 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 transition-all outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
