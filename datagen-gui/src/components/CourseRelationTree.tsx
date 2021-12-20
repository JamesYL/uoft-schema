import React, { useEffect } from "react";
import * as d3 from "d3";
export interface TreeNodeData {
  code: string;
  optional?: boolean;
  parentToThisMsg?: string;
}
export interface TreeNode extends TreeNodeData {
  children?: TreeNode[];
}
interface OutputTreeNode extends d3.HierarchyNode<TreeNodeData> {
  x: number;
  y: number;
}
interface OutputTreeLink extends d3.HierarchyLink<TreeNodeData> {
  source: OutputTreeNode;
  target: OutputTreeNode;
}
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const trueDim = [1000, 800];
const innerDim: [number, number] = [
  trueDim[0] - margin.left - margin.right,
  trueDim[1] - margin.top - margin.bottom,
];
const nodeRadius = 35;
const arrowRadius = 6;
const CourseRelationTree = ({ tree }: { tree: TreeNode }) => {
  useEffect(() => {
    const svg = d3
      .select("#course-graph")
      .attr("width", trueDim[0])
      .attr("height", trueDim[1])
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", "10")
      .attr("markerHeight", "7")
      .attr("refX", "0")
      .attr("refY", "3.5")
      .attr("orient", "auto")
      .attr("viewBox", "0 0 10 10")
      .append("polygon")
      .attr("points", "0 0, 4 3.5, 0 7");

    const treemap = d3.tree().size(innerDim);

    const nodes = treemap(
      d3.hierarchy(tree, (d) => d.children)
    ) as d3.HierarchyNode<TreeNodeData>;

    svg
      .selectAll("line")
      .data(
        nodes
          .descendants()
          .map((node) => node.links())
          .flat() as unknown as OutputTreeLink[]
      )
      .enter()
      .append("line")
      .style("stroke", "#aaa")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const h = Math.sqrt(dx ** 2 + dy ** 2);
        return d.source.x + (dx / h) * (h - nodeRadius - arrowRadius);
      })
      .attr("y2", (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const h = Math.sqrt(dx ** 2 + dy ** 2);
        return d.source.y + (dy / h) * (h - nodeRadius - arrowRadius);
      })
      .attr("marker-end", "url(#arrowhead)")
      .attr("stroke-width", 2);
    svg
      .selectAll("circle")
      .data(nodes.descendants() as unknown as OutputTreeNode[])
      .enter()
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", "#69b3a2")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("id", (d) => d.data.code);
    svg
      .selectAll("text")
      .data(nodes.descendants() as unknown as OutputTreeNode[])
      .enter()
      .append("text")
      .text((d) => d.data.code)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("stroke", "#000");
  }, [tree]);
  return (
    <>
      <svg id="course-graph"></svg>
    </>
  );
};

export default CourseRelationTree;
