import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const NeuralNetViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 600;
    const height = 300;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Define layers
    const layers = [3, 5, 4, 2]; // Nodes per layer
    const nodes: any[] = [];
    const links: any[] = [];
    let nodeId = 0;

    // Generate Nodes
    const layerXStep = width / (layers.length + 1);
    
    layers.forEach((nodeCount, layerIndex) => {
        const layerX = layerXStep * (layerIndex + 1);
        const layerYStep = height / (nodeCount + 1);
        
        for(let i=0; i<nodeCount; i++) {
            nodes.push({
                id: nodeId++,
                layer: layerIndex,
                x: layerX,
                y: layerYStep * (i + 1)
            });
        }
    });

    // Generate Links (Fully connected forward)
    nodes.forEach(source => {
        nodes.forEach(target => {
            if (target.layer === source.layer + 1) {
                links.push({ source, target });
            }
        });
    });

    // Draw Links with animation
    const linkSelection = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "#475569")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5);

    // Animate signals
    const animateSignal = () => {
        const duration = 2000;
        const circle = svg.append("circle")
            .attr("r", 4)
            .attr("fill", "#34d399")
            .attr("opacity", 0.8);
            
        // Pick random path
        let currentLayer = 0;
        let currentNode = nodes.filter(n => n.layer === 0)[Math.floor(Math.random() * layers[0])];
        
        circle.attr("cx", currentNode.x).attr("cy", currentNode.y);
        
        const path: any[] = [currentNode];
        while(currentLayer < layers.length - 1) {
            const nextLayerNodes = nodes.filter(n => n.layer === currentLayer + 1);
            const nextNode = nextLayerNodes[Math.floor(Math.random() * nextLayerNodes.length)];
            path.push(nextNode);
            currentLayer++;
            currentNode = nextNode;
        }

        // Transition chain
        let transition = circle.transition().duration(500).ease(d3.easeLinear);
        path.slice(1).forEach(targetNode => {
            transition = transition
                .attr("cx", targetNode.x)
                .attr("cy", targetNode.y)
                .transition().duration(500).ease(d3.easeLinear) as any;
        });
        
        transition.remove();
    };

    setInterval(animateSignal, 800);

    // Draw Nodes
    svg.selectAll("circle.node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 8)
        .attr("fill", d => d.layer === 0 ? "#60a5fa" : d.layer === layers.length - 1 ? "#f472b6" : "#e2e8f0");

  }, []);

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-2">Neural Network Architecture</h3>
        <svg ref={svgRef} width="100%" height="300" viewBox="0 0 600 300"></svg>
    </div>
  );
};