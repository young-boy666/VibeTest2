import React from 'react';
import { Topic, TopicId, LearningType } from '../types';
import { ChevronDown, Layers, BookOpen, Activity, Grid, ChevronRight, GraduationCap } from 'lucide-react';

interface TopNavProps {
  topics: Topic[];
  activeTopicId: TopicId;
  onSelectTopic: (id: TopicId) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ topics, activeTopicId, onSelectTopic }) => {
  // Group topics by their LearningType
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.type]) acc[topic.type] = [];
    acc[topic.type].push(topic);
    return acc;
  }, {} as Record<LearningType, Topic[]>);

  // Configuration for the top-level sections
  const sections = [
    { 
      type: LearningType.GENERAL, 
      label: 'Introduction', 
      icon: BookOpen, 
      color: 'text-emerald-400', 
      accent: 'border-emerald-500/50',
      bgHover: 'group-hover:bg-emerald-500/10',
      textHover: 'group-hover:text-emerald-300',
      alignSubMenu: 'left'
    },
    { 
      type: LearningType.SUPERVISED, 
      label: 'Supervised Learning', 
      icon: Activity, 
      color: 'text-blue-400', 
      accent: 'border-blue-500/50',
      bgHover: 'group-hover:bg-blue-500/10',
      textHover: 'group-hover:text-blue-300',
      alignSubMenu: 'left'
    },
    { 
      type: LearningType.UNSUPERVISED, 
      label: 'Unsupervised Learning', 
      icon: Grid, 
      color: 'text-purple-400', 
      accent: 'border-purple-500/50',
      bgHover: 'group-hover:bg-purple-500/10',
      textHover: 'group-hover:text-purple-300',
      alignSubMenu: 'right' 
    }
  ];

  const handleSectionClick = (e: React.MouseEvent, topicId: string, sectionId: string) => {
    e.stopPropagation();
    onSelectTopic(topicId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <nav className="w-full bg-slate-950 border-b border-slate-800/60 h-24 flex items-center justify-between px-6 lg:px-12 shadow-2xl z-50 relative shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-4 min-w-fit">
        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg shadow-emerald-900/20 transform hover:scale-105 transition-transform duration-300">
          <Layers className="text-white" size={26} />
        </div>
        <div className="hidden md:block">
          <span className="font-bold text-2xl text-white tracking-tight block leading-none">
            ML Master
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 block">
            Interactive Guide
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex items-center justify-center gap-2 lg:gap-8 h-full">
        {sections.map((section) => {
          const sectionTopics = groupedTopics[section.type] || [];
          const Icon = section.icon;
          // Check if any topic in this section is active
          const isSectionActive = sectionTopics.some(t => t.id === activeTopicId);

          return (
            <div key={section.type} className="relative group h-full flex items-center">
              <button 
                className={`
                  flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 border border-transparent
                  ${isSectionActive 
                    ? `bg-slate-900 ${section.accent} shadow-inner` 
                    : `hover:bg-slate-900 ${section.bgHover} hover:border-slate-800`}
                `}
              >
                <Icon className={`${isSectionActive ? section.color : 'text-slate-500 group-hover:text-slate-400'} transition-colors`} size={20} />
                <span className={`font-bold text-base lg:text-lg ${isSectionActive ? 'text-slate-100' : 'text-slate-400'} ${section.textHover} transition-colors whitespace-nowrap`}>
                  {section.label}
                </span>
                <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 group-hover:rotate-180 ${isSectionActive ? 'rotate-180 text-slate-300' : ''}`} />
              </button>

              {/* Main Dropdown (Topics) */}
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 pt-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top z-50">
                <div className="bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl overflow-visible p-2 ring-1 ring-white/5 flex flex-col gap-1">
                  
                  {/* Dropdown Header Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 border-t border-l border-slate-800 rotate-45"></div>

                  {sectionTopics.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-sm italic">Coming Soon</div>
                  )}

                  {sectionTopics.map(topic => {
                    const isTopicActive = topic.id === activeTopicId;
                    return (
                      <div key={topic.id} className="group/topic relative">
                        <button
                          onClick={() => onSelectTopic(topic.id)}
                          className={`
                            w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between
                            ${isTopicActive 
                              ? 'bg-slate-800/80 text-white shadow-sm' 
                              : 'text-slate-400 hover:bg-slate-900 hover:text-white'}
                          `}
                        >
                          <span className="flex items-center gap-3">
                             <span className={`w-1.5 h-1.5 rounded-full ${isTopicActive ? 'bg-emerald-400' : 'bg-slate-600 group-hover/topic:bg-emerald-500/50'}`}></span>
                             {topic.title}
                          </span>
                          <ChevronRight size={14} className={`text-slate-600 transition-all ${isTopicActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover/topic:opacity-100 group-hover/topic:translate-x-0'}`} />
                        </button>

                        {/* Sub-menu (Sections) - Pops out to side */}
                        <div 
                          className={`
                            absolute top-0 ${section.alignSubMenu === 'left' ? 'left-[98%] pl-2' : 'right-[98%] pr-2'} 
                            w-60 opacity-0 invisible group-hover/topic:opacity-100 group-hover/topic:visible transition-all duration-200 z-50
                          `}
                        >
                          <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden p-1.5 ring-1 ring-white/5">
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 mb-1 flex items-center gap-2">
                               <GraduationCap size={12} />
                               Topic Contents
                            </div>
                            
                            <button 
                              onClick={(e) => handleSectionClick(e, topic.id, 'overview')} 
                              className="w-full text-left px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-3 group/item"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover/item:bg-emerald-500 transition-colors"></div> 
                              Overview
                            </button>
                            
                            {topic.viz.type !== 'none' && (
                              <button 
                                onClick={(e) => handleSectionClick(e, topic.id, 'viz')} 
                                className="w-full text-left px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition-colors flex items-center gap-3 group/item"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-900 group-hover/item:bg-blue-500 transition-colors"></div> 
                                Interactive Viz
                              </button>
                            )}
                            
                            {topic.math.map((m, idx) => (
                              <button 
                                key={idx} 
                                onClick={(e) => handleSectionClick(e, topic.id, `math-${idx}`)} 
                                className="w-full text-left px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-orange-400 rounded-lg transition-colors truncate flex items-center gap-3 group/item"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-900 group-hover/item:bg-orange-500 transition-colors shrink-0"></div> 
                                <span className="truncate">{m.title}</span>
                              </button>
                            ))}
                            
                            <button 
                              onClick={(e) => handleSectionClick(e, topic.id, 'usecases')} 
                              className="w-full text-left px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-purple-400 rounded-lg transition-colors flex items-center gap-3 group/item"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-900 group-hover/item:bg-purple-500 transition-colors"></div> 
                              Use Cases
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Spacer / Right Action */}
      <div className="min-w-fit hidden lg:flex items-center justify-end">
          <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500">
             v1.0.0
          </div>
      </div>
    </nav>
  );
};