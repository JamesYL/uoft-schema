import { useEffect } from "react";
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
const dimForGraph = [1000, 800];
const dimForInfo = [1000, 200];
const innerDim: [number, number] = [
  dimForGraph[0] - margin.left - margin.right,
  dimForGraph[1] - margin.top - margin.bottom,
];
const nodeRadius = 50;
const arrowRadius = 20; // How close the arrowhead is to each node
const setupSVG = (): [
  d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  d3.Selection<SVGTextElement, unknown, HTMLElement, any>
] => {
  const graphSvg = d3.select("#course-graph");
  const infoSvg = d3.select("#course-info");
  graphSvg.selectAll("*").remove();
  infoSvg.selectAll("*").remove();
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

  const edgeTooltip = infoSvg
    .attr("width", dimForInfo[0])
    .attr("height", dimForInfo[1])
    .append("text")
    .attr("id", "#edge-tooltip")
    .attr("x", margin.left)
    .attr("y", margin.top + 25)
    .attr("font-size", 25)
    .style("fill", "black");

  return [g, edgeTooltip];
};

const CourseRelationTree = ({ tree }: { tree: TreeNode }) => {
  const nodes = d3.tree().size(innerDim)(
    d3.hierarchy(tree, (d) => d.children)
  ) as d3.HierarchyNode<TreeNodeData>;
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
      .attr("marker-end", "url(#arrowhead)")
      .attr("stroke-width", 7)
      .on("mouseover", function (_, d) {
        const msg = d.target.data.parentToThisMsg;
        if (msg) {
          d3.select(this).attr("stroke-width", 15);
          edgeTooltip.attr("visibility", "visible").text(msg);
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 7);
        edgeTooltip.attr("visibility", "hidden");
      });

    // Make nodes
    g.selectAll("circle")
      .data(nodes.descendants() as unknown as OutputTreeNode[])
      .enter()
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", "#69b3a2")
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
  }, [nodes]);
  return (
    <>
      <svg id="course-graph"></svg>
      <svg id="course-info"></svg>
    </>
  );
};

export default CourseRelationTree;
