import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Map, BookOpen } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface ChatAssistantProps {
  context: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  { text: "Create a 6-month roadmap", icon: Map },
  { text: "Explain SIP in detail", icon: BookOpen },
  { text: "How to save tax?", icon: Sparkles },
];

const ChatAssistant: React.FC<ChatAssistantProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Namaste! I am your personal guide. Ask me anything about your plan or request a roadmap to start your journey." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    const session = createChatSession(context);
    setChatSession(session);
  }, [context]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatSession) return;

    const newMessages: Message[] = [...messages, { role: 'user', text }];
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
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-teal-700 p-4 text-white flex items-center gap-2 shadow-sm">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Arth Sakhi Guide</h3>
          <p className="text-xs text-teal-100">Ask questions • Get Roadmaps • Learn Deeply</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                <Loader2 className="h-5 w-5 text-teal-600 animate-spin" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
         <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {SUGGESTIONS.map((s, i) => (
                <button 
                    key={i}
                    onClick={() => handleSendMessage(s.text)}
                    className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full hover:bg-teal-100 border border-teal-200 transition"
                >
                    <s.icon className="h-3 w-3" />
                    {s.text}
                </button>
            ))}
         </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;