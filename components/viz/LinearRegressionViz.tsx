import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { RefreshCw, Play } from 'lucide-react';

export const LinearRegressionViz: React.FC = () => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  // Generate random data roughly linear
  const generateData = () => {
    const newPoints = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * 100);
      const noise = (Math.random() - 0.5) * 40;
      const y = 0.8 * x + 10 + noise;
      newPoints.push({ x, y });
    }
    setPoints(newPoints);
    setSlope(0);
    setIntercept(0);
    setEpoch(0);
    setIsTraining(false);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Gradient Descent Step
  const step = () => {
    const learningRate = 0.0001;
    let dm = 0;
    let dc = 0;
    const n = points.length;

    points.forEach(p => {
      const pred = slope * p.x + intercept;
      const error = pred - p.y;
      dm += (2/n) * error * p.x;
      dc += (2/n) * error;
    });

    setSlope(s => s - learningRate * dm);
    setIntercept(c => c - learningRate * dc);
    setEpoch(e => e + 1);
  };

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(step, 20);
    }
    return () => clearInterval(interval);
  }, [isTraining, points, slope, intercept]);

  // Create line data for chart
  const lineData = useMemo(() => {
    return [
      { x: 0, y: intercept },
      { x: 100, y: slope * 100 + intercept }
    ];
  }, [slope, intercept]);

  // Combine for Recharts (trick to show line on scatter chart: use compposed chart or just overlay)
  // Recharts makes it hard to mix Line and Scatter easily on same axis without ComposedChart, 
  // but let's try a custom shape or just two layers if possible. 
  // Easier approach: Just plot the scatter, and render the line as a custom SVG reference.

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Gradient Descent Visualizer</h3>
          <div className="text-xs text-slate-400 font-mono mt-1">
            y = {slope.toFixed(2)}x + {intercept.toFixed(2)} | Epoch: {epoch}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsTraining(!isTraining)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${isTraining ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}
          >
            <Play size={14} fill={isTraining ? "currentColor" : "none"} />
            {isTraining ? 'Stop' : 'Train'}
          </button>
          <button onClick={generateData} className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 text-slate-300">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="size" stroke="#94a3b8" domain={[0, 100]} />
            <YAxis type="number" dataKey="y" name="price" stroke="#94a3b8" domain={[0, 120]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            />
            <Scatter name="Training Data" data={points} fill="#34d399" />
            {/* 
              Recharts ScatterChart doesn't support <Line> directly inside. 
              We use a trick: another Scatter with line prop, or just reference line?
              Recharts ReferenceLine is perfect here.
            */}
            {/* We can use ReferenceLine if we know start and end? No, ReferenceLine is usually horizontal/vertical or segment. 
                Let's use a Scatter with 'line' prop connecting 2 points.
            */}
            <Scatter 
              name="Regression Line" 
              data={lineData} 
              line={{ stroke: '#f472b6', strokeWidth: 3 }} 
              shape={() => <g></g>} // Hide the dots for the line
              legendType="none"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        The pink line adjusts automatically to minimize the distance to all green points.
      </p>
    </div>
  );
};