
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeProps {
  value: number; 
  label: string;
  unit: string;
  predictorName?: string;
  colorRange?: [string, string, string];
  size?: 'normal' | 'compact';
}

const GaugeChart: React.FC<GaugeProps> = ({ 
  value, 
  label, 
  unit, 
  predictorName,
  colorRange = ['#10b981', '#f59e0b', '#ef4444'],
  size = 'normal'
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = size === 'normal' ? 280 : 200;
  const height = size === 'normal' ? 180 : 140;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const radius = Math.min(width, height * 2) / 2 - 20;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height - 10})`);

    const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI / 2, Math.PI / 2]);

    const arcGenerator = d3.arc<any>()
      .innerRadius(radius - (size === 'normal' ? 30 : 20))
      .outerRadius(radius)
      .startAngle((d) => d.start)
      .endAngle((d) => d.end);

    const data = [
      { start: -Math.PI / 2, end: -Math.PI / 6, color: colorRange[0] }, 
      { start: -Math.PI / 6, end: Math.PI / 6, color: colorRange[1] },  
      { start: Math.PI / 6, end: Math.PI / 2, color: colorRange[2] }   
    ];

    g.selectAll('path').data(data).enter().append('path').attr('d', arcGenerator).attr('fill', (d) => d.color);

    const angle = scale(Math.min(100, Math.max(0, value)));
    const needle = g.append('g');
    needle.append('path')
      .attr('d', `M -6 0 L 0 ${-radius + 15} L 6 0 Z`)
      .attr('fill', '#0f172a')
      .attr('transform', `rotate(${(angle * 180) / Math.PI})`);
    needle.append('circle').attr('r', 8).attr('fill', '#0f172a');

    g.append('text')
      .attr('y', -radius - 20)
      .attr('text-anchor', 'middle')
      .attr('class', `${size === 'normal' ? 'text-4xl' : 'text-2xl'} font-black fill-slate-900`)
      .text(`${value.toFixed(1)}${unit}`);

    g.append('text')
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-black fill-slate-500 uppercase tracking-tighter')
      .text(label);

  }, [value, label, unit, colorRange, size, width, height]);

  return (
    <div className={`flex flex-col items-center bg-white ${size === 'normal' ? 'p-8' : 'p-4'} rounded-3xl shadow-sm border-2 border-slate-100 hover:border-slate-300 transition-colors`}>
      {predictorName && (
        <div className="mb-4 px-4 py-1 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase">
          {predictorName}
        </div>
      )}
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default GaugeChart;
