import React, { useState, useRef, useEffect } from 'react';
import { X, Send, BrainCircuit, Sparkles } from 'lucide-react';
import { Topic, ChatMessage } from '../types';
import { streamGeminiResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface GeminiTutorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: Topic;
}

export const GeminiTutor: React.FC<GeminiTutorProps> = ({ isOpen, onClose, currentTopic }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Hello! I'm your AI Tutor. I can help you understand **${currentTopic.title}** better. Ask me anything about the math or concepts!`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when topic changes
  useEffect(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: `We've switched topics. Ask me anything about **${currentTopic.title}**!`
    }]);
  }, [currentTopic.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Placeholder for stream
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isThinking: true }]);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    try {
      let fullResponse = "";
      const stream = streamGeminiResponse(currentTopic, userMsg.text, history);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(m => 
            m.id === modelMsgId 
              ? { ...m, text: fullResponse, isThinking: false } 
              : m
          )
        );
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={20} />
          <h2 className="font-bold text-white">AI Tutor</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`
                max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}
              `}
            >
              {msg.isThinking ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Sparkles size={14} className="animate-pulse" /> Thinking...
                </div>
              ) : (
                <div className="prose prose-invert prose-sm">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this topic..."
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          AI can make mistakes. Double check important info.
        </p>
      </div>
    </div>
  );
};