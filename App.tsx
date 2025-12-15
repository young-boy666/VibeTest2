import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { ContentArea } from './components/ContentArea';
import { GeminiTutor } from './components/GeminiTutor';
import { ML_TOPICS } from './constants';
import { Topic, TopicId } from './types';
import { BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<TopicId>(ML_TOPICS[0].id);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const activeTopic = ML_TOPICS.find(t => t.id === activeTopicId) || ML_TOPICS[0];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 overflow-hidden relative font-sans">
      {/* Top Navigation Bar */}
      <TopNav 
        topics={ML_TOPICS} 
        activeTopicId={activeTopicId} 
        onSelectTopic={setActiveTopicId} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto scroll-smooth w-full">
          <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
            <ContentArea topic={activeTopic} />
          </div>
        </main>
        
        {/* Floating Tutor Button */}
        <button 
          onClick={() => setIsTutorOpen(!isTutorOpen)}
          className="absolute bottom-8 right-8 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-900/20 transition-all hover:scale-105 z-40 flex items-center gap-3 group border border-emerald-400/20"
        >
          <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold pr-2 hidden md:inline">Ask AI Tutor</span>
        </button>
      </div>

      {/* Gemini Tutor Panel (Slide-over) */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-[60] w-full md:w-[450px] bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isTutorOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <GeminiTutor 
          isOpen={isTutorOpen} 
          onClose={() => setIsTutorOpen(false)} 
          currentTopic={activeTopic}
        />
      </div>

      {/* Overlay for Tutor */}
      {isTutorOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] backdrop-blur-sm"
          onClick={() => setIsTutorOpen(false)}
        />
      )}
    </div>
  );
};

export default App;