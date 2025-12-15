import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

export const LogisticRegressionViz: React.FC = () => {
  const [data, setData] = useState<Point[]>([]);
  // Line params: w1*x + w2*y + b = 0  =>  y = (-w1/w2)x - (b/w2)
  const [weights, setWeights] = useState({ w1: 1, w2: 1, b: 0 }); 
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [cost, setCost] = useState(0);

  // Generate two distinct clusters
  const generateData = () => {
    const points: Point[] = [];
    // Class 0: Bottom Left
    for (let i = 0; i < 20; i++) {
      points.push({
        x: Math.random() * 40 + 10,
        y: Math.random() * 40 + 10,
        label: 0
      });
    }
    // Class 1: Top Right
    for (let i = 0; i < 20; i++) {
      points.push({
        x: Math.random() * 40 + 50,
        y: Math.random() * 40 + 50,
        label: 1
      });
    }
    setData(points);
    // Randomize initial decision boundary
    setWeights({ 
      w1: Math.random() - 0.5, 
      w2: Math.random() - 0.5, 
      b: Math.random() * 10 
    });
    setEpoch(0);
    setCost(0);
    setIsTraining(false);
  };

  useEffect(() => {
    generateData();
  }, []);

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  const trainStep = () => {
    let { w1, w2, b } = weights;
    const learningRate = 0.05;
    let totalLoss = 0;
    
    // Gradients
    let dw1 = 0;
    let dw2 = 0;
    let db = 0;
    const m = data.length;

    data.forEach(p => {
      // Scale inputs for stability (roughly 0-1 range logic, though here 0-100)
      // For visualization simplicity, we use raw values but small LR
      const x1 = p.x;
      const x2 = p.y;
      
      const z = w1 * x1 + w2 * x2 + b;
      const h = sigmoid(z);
      
      // Log Loss
      // Avoid log(0)
      const safeH = Math.max(0.0001, Math.min(0.9999, h));
      totalLoss += -(p.label * Math.log(safeH) + (1 - p.label) * Math.log(1 - safeH));

      const error = h - p.label;
      dw1 += error * x1;
      dw2 += error * x2;
      db += error;
    });

    // Averaging gradients is standard, but for viz speed we might just scale LR
    w1 -= (learningRate / m) * dw1;
    w2 -= (learningRate / m) * dw2;
    b -= (learningRate / m) * db;

    setWeights({ w1, w2, b });
    setCost(totalLoss / m);
    setEpoch(prev => prev + 1);
  };

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(trainStep, 50);
    }
    return () => clearInterval(interval);
  }, [isTraining, weights, data]);

  // Calculate line endpoints for plotting y = mx + c
  // w1*x + w2*y + b = 0 => y = -(w1/w2)x - (b/w2)
  const getLinePoints = () => {
    const { w1, w2, b } = weights;
    if (Math.abs(w2) < 0.001) return []; // Vertical line avoidance for simple plot

    const m = -w1 / w2;
    const c = -b / w2;

    return [
      { x: 0, y: c },
      { x: 100, y: m * 100 + c }
    ];
  };

  const linePoints = getLinePoints();

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
       <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-white">Logistic Regression Classifier</h3>
          <div className="flex gap-4 text-xs font-mono mt-1 text-slate-400">
             <span>Log Loss: <span className={cost < 0.3 ? "text-emerald-400" : "text-orange-400"}>{cost.toFixed(4)}</span></span>
             <span>Epoch: {epoch}</span>
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

      <div className="h-72 w-full bg-slate-950/50 rounded-lg overflow-hidden relative border border-slate-800/50">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Feature 1" domain={[0, 100]} stroke="#64748b" />
            <YAxis type="number" dataKey="y" name="Feature 2" domain={[0, 100]} stroke="#64748b" />
            <Scatter name="Data" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.label === 1 ? '#3b82f6' : '#f43f5e'} />
              ))}
            </Scatter>
            {linePoints.length === 2 && (
                 <ReferenceLine 
                    segment={[{ x: linePoints[0].x, y: linePoints[0].y }, { x: linePoints[1].x, y: linePoints[1].y }]} 
                    stroke="#34d399" 
                    strokeWidth={3} 
                    strokeDasharray="5 5"
                />
            )}
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legend Overlay */}
        <div className="absolute top-2 right-2 bg-slate-900/80 p-2 rounded border border-slate-700 text-xs">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Class 1
            </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Class 0
            </div>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-2">
        <AlertCircle size={12} />
        The green dashed line represents the decision boundary (probability = 0.5).
      </p>
    </div>
  );
};