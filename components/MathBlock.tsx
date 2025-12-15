import React, { useEffect, useState } from 'react';
import katex from 'katex';

interface MathBlockProps {
  title: string;
  formula: string;
  description: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ title, formula, description }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const rendered = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
        output: 'html',
      });
      setHtml(rendered);
    } catch (e) {
      console.error("KaTeX Error:", e);
      setHtml(formula); // Fallback
    }
  }, [formula]);

  return (
    <div className="my-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</span>
      </div>
      <div className="p-6 flex flex-col items-center justify-center bg-slate-950/50">
        <div 
          className="text-2xl lg:text-3xl text-emerald-100 mb-4 text-center tracking-wide overflow-x-auto w-full"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="text-sm text-slate-400 text-center max-w-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};