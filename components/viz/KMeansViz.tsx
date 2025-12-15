import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import * as d3 from 'd3';

// Helper for D3 logic wrapper
export const KMeansViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dataPoints, setDataPoints] = useState<{ x: number, y: number, cluster: number }[]>([]);
  const [centroids, setCentroids] = useState<{ x: number, y: number, color: string }[]>([]);
  const [iteration, setIteration] = useState(0);

  const colors = ['#f472b6', '#34d399', '#60a5fa']; // Pink, Emerald, Blue
  const width = 400;
  const height = 300;

  // Initialize
  const init = () => {
    const points = [];
    // Generate 3 blobs
    for (let i = 0; i < 3; i++) {
      const cx = Math.random() * (width - 100) + 50;
      const cy = Math.random() * (height - 100) + 50;
      for (let j = 0; j < 30; j++) {
        points.push({
          x: cx + (Math.random() - 0.5) * 60,
          y: cy + (Math.random() - 0.5) * 60,
          cluster: -1
        });
      }
    }
    setDataPoints(points);
    
    // Random centroids
    const newCentroids = colors.map((c) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      color: c
    }));
    setCentroids(newCentroids);
    setIteration(0);
  };

  useEffect(() => {
    init();
  }, []);

  // K-Means Step
  const step = () => {
    // 1. Assign points to nearest centroid
    const newPoints = dataPoints.map(p => {
      let minDist = Infinity;
      let clusterIndex = -1;
      centroids.forEach((c, idx) => {
        const dist = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = idx;
        }
      });
      return { ...p, cluster: clusterIndex };
    });

    // 2. Update centroids
    const newCentroids = centroids.map((c, idx) => {
      const clusterPoints = newPoints.filter(p => p.cluster === idx);
      if (clusterPoints.length === 0) return c; // Avoid division by zero
      const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
      return { ...c, x: avgX, y: avgY };
    });

    setDataPoints(newPoints);
    setCentroids(newCentroids);
    setIteration(prev => prev + 1);
  };

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw connection lines first (optional, looks messy if too many)
    
    // Draw points
    svg.selectAll("circle.point")
      .data(dataPoints)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 4)
      .attr("fill", d => d.cluster === -1 ? "#64748b" : colors[d.cluster])
      .attr("opacity", 0.6);

    // Draw centroids
    svg.selectAll("circle.centroid")
      .data(centroids)
      .enter()
      .append("circle")
      .attr("class", "centroid")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 10)
      .attr("fill", d => d.color)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  }, [dataPoints, centroids]);

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">K-Means Clustering</h3>
          <p className="text-xs text-slate-400">Iteration: {iteration}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={step} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
            Step <ArrowRight size={14} />
          </button>
          <button onClick={init} className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 text-slate-300">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="w-full h-64 bg-slate-950 rounded-lg overflow-hidden relative">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="cursor-crosshair"></svg>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        Click 'Step' to assign points to the nearest color center and move the center to the average position.
      </p>
    </div>
  );
};