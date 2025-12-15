import React from 'react';
import { Topic, TopicId, LearningType } from '../types';
import { BookOpen, ChevronRight, Activity, Layers, Grid } from 'lucide-react';

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
              {groupTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group
                    ${activeTopicId === topic.id 
                      ? 'bg-slate-800 text-white shadow-md border-l-2 border-emerald-500' 
                      : 'hover:bg-slate-800/50 hover:text-white'}
                  `}
                >
                  <span>{topic.title}</span>
                  {activeTopicId === topic.id && <ChevronRight size={14} className="text-emerald-500" />}
                </button>
              ))}
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