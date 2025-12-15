import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ArrowRight, Layers, Maximize } from 'lucide-react';
import * as d3 from 'd3';

export const PCAViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<{ x: number, y: number, ox: number, oy: number }[]>([]);
  const [showVectors, setShowVectors] = useState(false);
  const [projected, setProjected] = useState(false);

  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;

  // Generate correlated data (ellipse shape)
  const generateData = () => {
    const newPoints = [];
    for (let i = 0; i < 40; i++) {
      // Create data along a diagonal line y = x with some noise
      const dist = (Math.random() - 0.5) * 200; // Spread along axis
      const noise = (Math.random() - 0.5) * 60;  // Spread perp to axis
      
      // Rotate 45 degrees roughly
      const x = centerX + dist + noise;
      const y = centerY + dist - noise; 
      
      newPoints.push({ x, y, ox: x, oy: y });
    }
    setPoints(newPoints);
    setShowVectors(false);
    setProjected(false);
  };

  useEffect(() => {
    generateData();
  }, []);

  const toggleVectors = () => setShowVectors(!showVectors);
  
  const toggleProjection = () => {
    if (projected) {
      // Reset to original positions
      setPoints(prev => prev.map(p => ({ ...p, x: p.ox, y: p.oy })));
    } else {
      // Project onto the line y = x (roughly the PC1 for this data generation)
      // Vector for PC1 is (1, 1). Normalized: (0.707, 0.707)
      // Projection of point P onto Line L passing through C with direction V:
      // P_proj = C + dot(P-C, V) * V
      const v = { x: 0.707, y: 0.707 };
      
      setPoints(prev => prev.map(p => {
        const pdx = p.ox - centerX;
        const pdy = p.oy - centerY;
        const dot = pdx * v.x + pdy * v.y;
        
        return {
            ...p,
            x: centerX + dot * v.x,
            y: centerY + dot * v.y
        };
      }));
    }
    setProjected(!projected);
  };

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw Axis (Principal Components) if enabled
    if (showVectors) {
        // PC1
        svg.append("line")
           .attr("x1", centerX).attr("y1", centerY)
           .attr("x2", centerX + 100).attr("y2", centerY + 100)
           .attr("stroke", "#f97316") // Orange
           .attr("stroke-width", 3)
           .attr("marker-end", "url(#arrowhead-orange)");
           
        svg.append("text")
           .attr("x", centerX + 110).attr("y", centerY + 100)
           .text("PC1 (High Variance)")
           .attr("fill", "#f97316")
           .attr("font-size", "10px");

        // PC2
        svg.append("line")
           .attr("x1", centerX).attr("y1", centerY)
           .attr("x2", centerX + 40).attr("y2", centerY - 40)
           .attr("stroke", "#3b82f6") // Blue
           .attr("stroke-width", 3)
           .attr("marker-end", "url(#arrowhead-blue)");
           
         svg.append("text")
           .attr("x", centerX + 45).attr("y", centerY - 45)
           .text("PC2")
           .attr("fill", "#3b82f6")
           .attr("font-size", "10px");
    }

    // Define Arrowheads
    const defs = svg.append("defs");
    ["orange", "blue"].forEach(color => {
         const cHex = color === "orange" ? "#f97316" : "#3b82f6";
         defs.append("marker")
        .attr("id", `arrowhead-${color}`)
        .attr("markerWidth", 10)
        .attr("markerHeight", 7)
        .attr("refX", 9)
        .attr("refY", 3.5)
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", "0 0, 10 3.5, 0 7")
        .attr("fill", cHex);
    });
   
    // Draw projection lines if projected
    if (projected) {
        svg.selectAll("line.proj")
           .data(points)
           .enter()
           .append("line")
           .attr("class", "proj")
           .attr("x1", d => d.ox)
           .attr("y1", d => d.oy)
           .attr("x2", d => d.x)
           .attr("y2", d => d.y)
           .attr("stroke", "#475569")
           .attr("stroke-dasharray", "4")
           .attr("opacity", 0.5);
    }

    // Draw points
    svg.selectAll("circle.point")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 5)
      .attr("fill", "#34d399") // Emerald
      .attr("opacity", 0.8)
      .attr("stroke", "#022c22")
      .attr("stroke-width", 1);
      
    // Add transition if needed, but react state update handles positions nicely usually. 
    // For smooth d3 transition, we would bind data and use .transition(), 
    // but mixing React state coordinates with D3 enter/update is simpler here.

  }, [points, showVectors, projected]);

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-white">PCA: Dimensionality Reduction</h3>
          <p className="text-xs text-slate-400">Reduce 2D data to 1D along the principal component</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={toggleVectors} 
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${showVectors ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}
           >
            <Maximize size={14} />
            {showVectors ? 'Hide Vectors' : 'Show Vectors'}
          </button>
           <button 
             onClick={toggleProjection} 
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${projected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}
           >
            <Layers size={14} />
            {projected ? 'Restore 2D' : 'Project to 1D'}
          </button>
          <button onClick={generateData} className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 text-slate-300">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="w-full h-64 bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800/50">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}></svg>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        PC1 (Orange) represents the direction of maximum variance. Projecting data onto it keeps the most information.
      </p>
    </div>
  );
};