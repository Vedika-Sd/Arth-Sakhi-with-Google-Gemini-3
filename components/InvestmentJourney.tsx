import React, { useState, useEffect, useRef } from 'react';
import { Send, Briefcase, ChevronRight, CheckCircle2, TrendingUp, Shield, Layers, Loader2 } from 'lucide-react';
import { createInvestmentChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface InvestmentJourneyProps {
  context: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const JOURNEY_PATHS = [
  { 
    id: 'sip', 
    title: "Start First SIP", 
    prompt: "I want to start my first SIP. Based on my risk profile, suggest 3 specific mutual funds (with names like HDFC/SBI/etc), explain why they fit me, and list the exact steps to buy them online.",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-700"
  },
  { 
    id: 'insurance', 
    title: "Get Best Insurance", 
    prompt: "I need insurance. Analyze my age and income. Suggest specifically: 1) How much Term Cover I need, 2) How much Health Cover, and 3) What specific features (riders) I should look for when comparing policies.",
    icon: Shield,
    color: "bg-blue-100 text-blue-700"
  },
  { 
    id: 'tax', 
    title: "Save Tax (ELSS/PPF)", 
    prompt: "Help me save tax. Compare ELSS Mutual Funds vs PPF for me. Suggest 2 top performing ELSS funds currently and explain the lock-in rules.",
    icon: Layers,
    color: "bg-purple-100 text-purple-700"
  }
];

const InvestmentJourney: React.FC<InvestmentJourneyProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to your Investment Cockpit. I am here to help you take action. Select a goal below to get specific recommendations and fund names." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = createInvestmentChatSession(context);
    setChatSession(session);
  }, [context]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string, isHiddenPrompt = false) => {
    if (!text.trim() || !chatSession) return;

    // If it's a hidden prompt (from clicking a card), show a shorter user message
    const displayText = isHiddenPrompt ? text : text; 
    
    // However, for the cards, we usually want to show the Title, but send the Prompt.
    // In this simplified version, we'll just append the text. 
    // If it's a card click, we append the card title visually, but send the detailed prompt.
    
    // Logic handled in handleCardClick
    
    const newMessages: Message[] = [...messages, { role: 'user', text: displayText }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: text });
      const responseText = response.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("Investment Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (path: typeof JOURNEY_PATHS[0]) => {
     // Visually show the title, but send the detailed prompt
     const newMessages: Message[] = [...messages, { role: 'user', text: `Selected: ${path.title}` }];
     setMessages(newMessages);
     setIsLoading(true);
     
     if(!chatSession) return;

     chatSession.sendMessage({ message: path.prompt })
        .then(response => {
             if(response.text) {
                 setMessages(prev => [...prev, { role: 'model', text: response.text }]);
             }
        })
        .catch(err => {
            setMessages(prev => [...prev, { role: 'model', text: "Error fetching specific advice." }]);
        })
        .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-50 rounded-xl border border-indigo-100 overflow-hidden shadow-sm">
      
      {/* Action Header */}
      <div className="bg-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Investment Journey</h3>
            <p className="text-xs text-indigo-200">Actionable Steps • Fund Names • Comparisons</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">Expert Advice</span>
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Analyzing market data...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Cards (Only show if few messages or user interaction needed) */}
      <div className="px-4 pb-2">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Start a Workflow</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {JOURNEY_PATHS.map((path) => (
                <button
                    key={path.id}
                    onClick={() => handleCardClick(path)}
                    disabled={isLoading}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                >
                    <div className={`p-2 rounded-lg ${path.color}`}>
                        <path.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-700 text-sm group-hover:text-indigo-700">{path.title}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-400" />
                </button>
            ))}
         </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 mt-2">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask specific questions (e.g. 'Compare HDFC vs ICICI Bluechip')..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestmentJourney;
