import React from 'react';
import { Topic } from '../types';
import { MathBlock } from './MathBlock';
import { LinearRegressionViz } from './viz/LinearRegressionViz';
import { KMeansViz } from './viz/KMeansViz';
import { NeuralNetViz } from './viz/NeuralNetViz';
import { PCAViz } from './viz/PCAViz';

interface ContentAreaProps {
  topic: Topic;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ topic }) => {
  const renderViz = () => {
    switch (topic.viz.type) {
      case 'linear-regression': return <LinearRegressionViz />;
      case 'k-means': return <KMeansViz />;
      case 'neural-network': return <NeuralNetViz />;
      case 'pca': return <PCAViz />;
      default: return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest">{topic.type}</span>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-2 mb-4 tracking-tight">{topic.title}</h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl border-l-4 border-emerald-500 pl-6">
          {topic.description}
        </p>
      </div>

      {/* Main Content Text */}
      <div className="prose prose-invert prose-lg max-w-none text-slate-300 mb-12">
        <p className="whitespace-pre-line">{topic.content}</p>
      </div>

      {/* Visualization Section */}
      {topic.viz.type !== 'none' && (
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-px bg-slate-800 flex-1"></div>
             <span className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Interactive Visualization</span>
             <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          {renderViz()}
        </div>
      )}

      {/* Math Section */}
      {topic.math.length > 0 && (
        <div className="mb-16">
           <div className="flex items-center gap-4 mb-6">
             <div className="h-px bg-slate-800 flex-1"></div>
             <span className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Mathematical Rigor</span>
             <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          <div className="grid gap-6">
            {topic.math.map((m, idx) => (
              <MathBlock key={idx} title={m.title} formula={m.formula || ''} description={m.content} />
            ))}
          </div>
        </div>
      )}

      {/* Use Cases */}
      <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6">Real World Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topic.useCases.map((uc, i) => (
            <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm">
                {i + 1}
              </span>
              <span className="font-medium">{uc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};