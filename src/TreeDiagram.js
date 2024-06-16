// src/TreeDiagram.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TreeDiagram({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous SVG contents on update
    const width = 800;
    const height = 500;
    svg.attr('width', width).attr('height', height);

    const treeData = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height - 100, width - 200]);
    const nodes = treeLayout(treeData).descendants();
    const links = treeLayout(treeData).links();

    const g = svg.append('g')
      .attr('transform', 'translate(100,50)');

    // Draw links (lines between nodes)
    g.selectAll('.link')
      .data(links)
      .enter().append('path')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-width', 2);

    // Draw nodes (circles)
    g.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .attr('cx', d => d.y)
      .attr('cy', d => d.x)
      .attr('fill', 'lightblue');

  }, [data]); // Redraw diagram if data changes

  return <svg ref={ref}></svg>;
}

export default TreeDiagram;
