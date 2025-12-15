import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { GeminiTutor } from './components/GeminiTutor';
import { ML_TOPICS } from './constants';
import { Topic, TopicId } from './types';
import { Menu, X, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<TopicId>(ML_TOPICS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const activeTopic = ML_TOPICS.find(t => t.id === activeTopicId) || ML_TOPICS[0];

  // Responsive sidebar check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 z-20 justify-between">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ML Master
        </span>
        <button onClick={() => setIsTutorOpen(!isTutorOpen)} className="p-2 text-emerald-400 hover:text-emerald-300">
          <BrainCircuit size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        <Sidebar 
          topics={ML_TOPICS} 
          activeTopicId={activeTopicId} 
          onSelectTopic={(id) => {
            setActiveTopicId(id);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden pt-16 lg:pt-0">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto pb-24">
            <ContentArea topic={activeTopic} />
          </div>
        </main>
        
        {/* Floating Tutor Button (Desktop) */}
        <button 
          onClick={() => setIsTutorOpen(!isTutorOpen)}
          className="hidden lg:flex absolute bottom-8 right-8 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 z-40 items-center gap-2"
        >
          <BrainCircuit size={24} />
          <span className="font-bold">Ask AI Tutor</span>
        </button>
      </div>

      {/* Gemini Tutor Panel */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isTutorOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <GeminiTutor 
          isOpen={isTutorOpen} 
          onClose={() => setIsTutorOpen(false)} 
          currentTopic={activeTopic}
        />
      </div>

      {/* Overlay for mobile sidebar/tutor */}
      {(isSidebarOpen && window.innerWidth < 1024) || (isTutorOpen && window.innerWidth < 768) ? (
        <div 
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => {
            setIsSidebarOpen(false);
            if (window.innerWidth < 768) setIsTutorOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default App;