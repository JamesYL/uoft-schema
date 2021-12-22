import { useEffect, useState } from "react";
import { select, Selection } from "d3-selection";
import { hierarchy, tree } from "d3-hierarchy";
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
const nodeRadius = 70;

const setupSVG = (
  dimForGraph: [number, number],
  innerDim: [number, number]
): [
  Selection<SVGGElement, unknown, HTMLElement, any>,
  Selection<d3.BaseType, unknown, HTMLElement, any>
] => {
  const graphSvg = select("#course-graph");
  graphSvg.selectAll("*").remove();
  const g = graphSvg
    .attr("width", dimForGraph[0])
    .attr("height", dimForGraph[1])
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const textBoxCoords = [margin.left, innerDim[1] + 100];
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

const CourseRelationTree = ({
  treeData,
  width,
  height,
}: {
  treeData: TreeNode;
  width: number;
  height: number;
}) => {
  const dimForGraph: [number, number] = [width, height];
  const innerDim: [number, number] = [
    dimForGraph[0] - margin.left - margin.right,
    dimForGraph[1] - margin.top - margin.bottom,
  ];

  const root = hierarchy(treeData);
  tree().nodeSize([nodeRadius * 2, nodeRadius * 2])(root);

  const [hoveredEdge, setHoveredEdge] = useState<OutputTreeLink | null>(null);
  useEffect(() => {
    const [g, edgeTooltip] = setupSVG(dimForGraph, innerDim);
    let minX = 0;
    let minY = 0;
    let data = root.descendants() as unknown as OutputTreeNode[];
    data.forEach((item) => {
      minX = Math.min(item.x, minX);
      minY = Math.min(item.y, minY);
    });
    data = data.map((item) => {
      item.x -= minX;
      item.x -= minY;
      return item;
    });
    // Make edges between nodes
    g.selectAll("line")
      .data(
        data.map((node) => node.links()).flat() as unknown as OutputTreeLink[]
      )
      .enter()
      .append("line")
      .style("stroke", (d) => (d.target.data.optional ? "red" : "green"))
      .style("stroke-dasharray", (d) =>
        d.target.data.parentToThisMsg ? "0" : "10,10"
      )
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr(
        "id",
        (d) =>
          `#c${~~d.source.x}x${~~d.source.y}y${~~d.target.x}x${~~d.target.y}y`
      )
      .attr("stroke-width", 7)
      .on("mouseenter", function (_, d) {
        const msg = d.target.data.parentToThisMsg;
        if (!msg) return;
        select(this).attr("stroke-width", 15);
        edgeTooltip.text(msg);
        if (hoveredEdge) {
          if (
            hoveredEdge.source.x === d.source.x &&
            hoveredEdge.source.y === d.source.y &&
            hoveredEdge.target.x === d.target.x &&
            hoveredEdge.target.y === d.target.y
          )
            return;
          const id = `#c${~~hoveredEdge.source.x}x${~~hoveredEdge.source
            .y}y${~~hoveredEdge.target.x}x${~~hoveredEdge.target.y}y`;
          select(id).attr("stroke-width", 7);
        }
        setHoveredEdge(d);
      });

    // Make nodes
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .style("fill", "lightgray")
      .style("stroke", "black")
      .attr("r", nodeRadius - 20)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("id", (d) => d.data.code);

    // Add text inside of nodes
    g.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.data.code)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("stroke", "#000");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);
  return <svg id="course-graph"></svg>;
};

export default CourseRelationTree;
