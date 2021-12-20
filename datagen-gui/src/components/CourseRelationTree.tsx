import { useEffect, useState } from "react";
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
const margin = { top: 50, right: 50, bottom: 400, left: 50 };
const dimForGraph = [1000, 800];
const innerDim: [number, number] = [
  dimForGraph[0] - margin.left - margin.right,
  dimForGraph[1] - margin.top - margin.bottom,
];
const nodeRadius = 50;
const arrowRadius = 20; // How close the arrowhead is to each node
const setupSVG = (): [
  d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  d3.Selection<d3.BaseType, unknown, HTMLElement, any>
] => {
  const graphSvg = d3.select("#course-graph");
  graphSvg.selectAll("*").remove();
  const g = graphSvg
    .attr("width", dimForGraph[0])
    .attr("height", dimForGraph[1])
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  g.append("defs")
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

  const textBoxCoords = [margin.left, innerDim[1] + nodeRadius * 3];
  const helperText = graphSvg
    .append("text")
    .attr("id", "#edge-tooltip")
    .attr("x", textBoxCoords[0])
    .attr("y", textBoxCoords[1])
    .attr("font-size", 25)
    .style("fill", "black");

  helperText
    .append("tspan")
    .text(
      "The graph describes a relationship betwen courses for a given course."
    )
    .attr("x", margin.left);
  helperText
    .append("tspan")
    .text(
      "For a given node, all children with green edges (if any) must be followed."
    )
    .attr("dy", "1em")
    .attr("x", margin.left);
  helperText
    .append("tspan")
    .text(
      "For a given node, one of the children with red edges (if any) must be followed."
    )
    .attr("dy", "1em")
    .attr("x", margin.left);
  helperText
    .append("tspan")
    .attr("dy", "1.5em")
    .attr("x", margin.left)
    .text("For solid lines, hover over them for more information.");
  const edgeToolTip = graphSvg
    .append("foreignObject")
    .attr("x", margin.left)
    .attr("y", textBoxCoords[1] + 110)
    .attr("width", innerDim[0])
    .attr("height", 9999)
    .attr("font-size", 25)
    .append("xhtml:div")
    .style("font-weight", "bold");
  return [g, edgeToolTip];
};

const CourseRelationTree = ({ tree }: { tree: TreeNode }) => {
  const nodes = d3.tree().size(innerDim)(
    d3.hierarchy(tree, (d) => d.children)
  ) as d3.HierarchyNode<TreeNodeData>;
  const [hoveredEdge, setHoveredEdge] = useState<OutputTreeLink | null>(null);
  useEffect(() => {
    const [g, edgeTooltip] = setupSVG();

    // Make edges between nodes
    g.selectAll("line")
      .data(
        nodes
          .descendants()
          .map((node) => node.links())
          .flat() as unknown as OutputTreeLink[]
      )
      .enter()
      .append("line")
      .style("stroke", (d) => (d.target.data.optional ? "green" : "red"))
      .style("stroke-dasharray", (d) =>
        d.target.data.parentToThisMsg ? "0" : "10,10"
      )
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
      .attr(
        "id",
        (d) => `#c${d.source.x}x${d.source.y}y${d.target.x}x${d.target.y}y`
      )
      .attr("marker-end", "url(#arrowhead)")
      .attr("stroke-width", 7)
      .on("mouseenter", function (_, d) {
        const msg = d.target.data.parentToThisMsg;
        if (!msg) return;
        d3.select(this).attr("stroke-width", 15);
        edgeTooltip.text(msg);
        if (hoveredEdge) {
          if (
            hoveredEdge.source.x === d.source.x &&
            hoveredEdge.source.y === d.source.y &&
            hoveredEdge.target.x === d.target.x &&
            hoveredEdge.target.y === d.target.y
          )
            return;
          const id = `#c${hoveredEdge.source.x}x${hoveredEdge.source.y}y${hoveredEdge.target.x}x${hoveredEdge.target.y}y`;
          d3.select(id).attr("stroke-width", 7);
        }
        setHoveredEdge(d);
      });

    // Make nodes
    g.selectAll("circle")
      .data(nodes.descendants() as unknown as OutputTreeNode[])
      .enter()
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", "lightgray")
      .style("stroke", "black")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("id", (d) => d.data.code);

    // Add text inside of nodes
    g.selectAll("text")
      .data(nodes.descendants() as unknown as OutputTreeNode[])
      .enter()
      .append("text")
      .text((d) => d.data.code)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("stroke", "#000");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
  return <svg id="course-graph"></svg>;
};

export default CourseRelationTree;
