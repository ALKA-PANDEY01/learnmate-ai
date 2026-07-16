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
  HelpCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

const SUGGESTIONS = [
  "Explain the Virtual DOM in simple terms",
  "How do I optimize Tailwind CSS v4 builds?",
  "What is active recall and how do I practice it?",
  "What is the difference between useMemo and useCallback?"
];

const MOCK_ANSWERS = {
  "virtual dom": "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React updates the virtual DOM first, diffs it against the previous virtual DOM snapshot (using a reconciliation algorithm), and only paints the actual differences on the real DOM. This batches edits and avoids expensive complete page reflows.",
  "tailwind": "Tailwind CSS v4 introduces a Rust-based compiler engine designed for maximum speed. It eliminates the need for `tailwind.config.js` by parsing configuration variables directly in your main CSS file using CSS variables and standard directives (like `@theme`). You simply import it with `@import 'tailwindcss';` in your index.css.",
  "active recall": "Active recall is a learning strategy that involves testing your memory rather than passively reviewing notes. Instead of re-reading a textbook, you ask yourself questions and actively retrieve information from your brain. This strengthens neural pathways, leading to much higher long-term memory retention rates.",
  "usememo": "In React, `useMemo` and `useCallback` are hooks used for performance optimization through memoization:\n- `useMemo` memoizes the **result of a function calculation** (returning a cached value/object).\n- `useCallback` memoizes the **function instance itself** (returning a cached callback hook reference).\nBoth recalculate only when their dependency arrays mutate.",
  "default": "That is an excellent study question! As your AI Study Mentor, I recommend structuring a 25-minute Pomodoro focus session to explore this concept. Would you like me to generate a set of flashcards or a quiz on this topic to test your active recall?"
};

export default function AIMentorPage() {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mentor',
      text: "Hello! I am your AI Study Mentor. Ask me any questions about your active roadmap, explain complex concepts, or request quick review questions. What are we studying today?",
      time: '21:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const chatHistory = [
    { id: 1, title: 'React 19 Fiber architecture', active: true },
    { id: 2, title: 'Tailwind CSS v4 configurations', active: false },
    { id: 3, title: 'Active Recall vs Spaced Repetition', active: false }
  ];

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Simulate AI Response Delay
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let responseText = MOCK_ANSWERS.default;
      
      // Basic keyword matching
      if (query.includes('virtual dom') || query.includes('reconciler')) {
        responseText = MOCK_ANSWERS["virtual dom"];
      } else if (query.includes('tailwind') || query.includes('css v4')) {
        responseText = MOCK_ANSWERS.tailwind;
      } else if (query.includes('active recall') || query.includes('recall')) {
        responseText = MOCK_ANSWERS["active recall"];
      } else if (query.includes('memo') || query.includes('usememo') || query.includes('callback')) {
        responseText = MOCK_ANSWERS.usememo;
      }

      const mentorMsg = {
        id: Date.now() + 1,
        sender: 'mentor',
        text: responseText,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex gap-6 overflow-hidden relative animate-in fade-in duration-300">
      <SEO title="AI Mentor Chat" description="Query your personal study tutor agent, get concepts explained, and trigger recall reviews." />

      {/* Left Chat Sidebar (Desktop Only) */}
      <div className="hidden md:flex flex-col w-64 rounded-2xl border border-border/50 glass overflow-hidden shrink-0">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground font-display flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary" />
            <span>Chat Sessions</span>
          </span>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1 rounded bg-muted/10 hover:bg-muted/20 border border-border/30 text-muted hover:text-foreground transition-colors"
            title="Clear Chat"
          >
            <PlusCircle size={14} />
          </button>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
          {chatHistory.map(session => (
            <div
              key={session.id}
              className={`
                flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer
                ${session.active
                  ? 'bg-primary/5 text-primary border border-primary/10 font-medium'
                  : 'text-muted hover:text-foreground hover:bg-card/45 border border-transparent'
                }
              `}
            >
              <span className="truncate max-w-[170px]">{session.title}</span>
              <ChevronRight size={12} className="text-muted/60" />
            </div>
          ))}
        </div>
      </div>

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
                Active Learning Agent
              </span>
            </div>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMentor = msg.sender === 'mentor';
            return (
              <div
                key={msg.id}
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
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-muted block px-1">{msg.time}</span>
                </div>
              </div>
            );
          })}

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
