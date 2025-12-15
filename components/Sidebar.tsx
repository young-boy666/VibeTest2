import React from 'react';
import { Topic, TopicId, LearningType } from '../types';
import { BookOpen, ChevronRight, Activity, Layers, Grid, ChevronDown, Circle } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  activeTopicId: TopicId;
  onSelectTopic: (id: TopicId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ topics, activeTopicId, onSelectTopic }) => {
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.type]) acc[topic.type] = [];
    acc[topic.type].push(topic);
    return acc;
  }, {} as Record<LearningType, Topic[]>);

  const getIconForType = (type: LearningType) => {
    switch (type) {
      case LearningType.SUPERVISED: return <Activity size={16} className="text-blue-400" />;
      case LearningType.UNSUPERVISED: return <Grid size={16} className="text-purple-400" />;
      default: return <BookOpen size={16} className="text-emerald-400" />;
    }
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering parent button click
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
          <Layers className="text-blue-500" />
          ML Master
        </h1>
        <p className="text-xs text-slate-500 mt-2">Interactive Machine Learning Guide</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {(Object.entries(groupedTopics) as [string, Topic[]][]).map(([type, groupTopics]) => (
          <div key={type}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              {getIconForType(type as LearningType)}
              {type}
            </h3>
            <div className="space-y-1">
              {groupTopics.map((topic) => {
                const isActive = activeTopicId === topic.id;
                
                return (
                  <div key={topic.id} className="flex flex-col">
                    <button
                      onClick={() => onSelectTopic(topic.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group
                        ${isActive 
                          ? 'bg-slate-800 text-white shadow-md border-l-2 border-emerald-500' 
                          : 'hover:bg-slate-800/50 hover:text-white'}
                      `}
                    >
                      <span className="font-medium">{topic.title}</span>
                      {isActive ? <ChevronDown size={14} className="text-emerald-500" /> : <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />}
                    </button>
                    
                    {/* Subsections Table of Contents (Only for active topic) */}
                    {isActive && (
                      <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-800 space-y-1 py-1 animate-fadeIn">
                        <button 
                          onClick={(e) => scrollToSection(e, 'overview')}
                          className="w-full text-left text-xs py-1 px-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded transition-colors flex items-center gap-2"
                        >
                          Overview
                        </button>
                        
                        {topic.viz.type !== 'none' && (
                          <button 
                            onClick={(e) => scrollToSection(e, 'viz')}
                            className="w-full text-left text-xs py-1 px-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded transition-colors"
                          >
                            Visualization
                          </button>
                        )}
                        
                        {topic.math.map((m, idx) => (
                           <button 
                            key={idx}
                            onClick={(e) => scrollToSection(e, `math-${idx}`)}
                            className="w-full text-left text-xs py-1 px-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded transition-colors truncate"
                            title={m.title}
                          >
                            {m.title}
                          </button>
                        ))}
                        
                         <button 
                            onClick={(e) => scrollToSection(e, 'usecases')}
                            className="w-full text-left text-xs py-1 px-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded transition-colors"
                          >
                            Use Cases
                          </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        Built with React & Gemini
      </div>
    </div>
  );
};