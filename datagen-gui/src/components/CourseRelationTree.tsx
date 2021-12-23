import { useEffect, useState } from "react";
import { select, Selection } from "d3-selection";
import { tree, stratify } from "d3-hierarchy";
import { zoom } from "d3-zoom";

export interface TreeNodeData {
  code?: string;
  optional?: boolean;
  parentToThisMsg?: string;
}
export interface TreeNode extends TreeNodeData {
  id: number;
  parentId?: number;
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
const emptyNodeRadius = 20;
/** Width, height */
const nonEmptyNodeSize: [number, number] = [100, 30];
const dimForGraph: [number, number] = [1000, 1000];
const innerDim: [number, number] = [
  dimForGraph[0] - margin.left - margin.right,
  dimForGraph[1] - margin.top - margin.bottom,
];
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
    .style("background-color", "#F5F5F5")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const textBoxCoords = [margin.left, innerDim[1] + 200];
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
  const zoomHandler = zoom().on("zoom", (e) => {
    g.attr("transform", e.transform);
  });
  //@ts-ignore
  graphSvg.call(zoomHandler);
  return [g, edgeToolTip];
};

const CourseRelationTree = ({ treeData }: { treeData: TreeNode[] }) => {
  const [hoveredEdge, setHoveredEdge] = useState<OutputTreeLink | null>(null);

  useEffect(() => {
    let root = stratify()([{ id: 0 }]);

    if (treeData.length) {
      root = stratify()(treeData);
    }
    tree().nodeSize([emptyNodeRadius * 7, emptyNodeRadius * 5])(root);
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

    // Make nodes for non empty nodes
    g.selectAll("rect")
      .data(data)
      .enter()
      .filter((d) => !!d.data.code)
      .append("rect")
      .style("fill", "lightgray")
      .style("stroke", "black")
      .attr("width", nonEmptyNodeSize[0])
      .attr("height", nonEmptyNodeSize[1])
      .attr("x", (d) => d.x - emptyNodeRadius * 2.5)
      .attr("y", (d) => d.y)
      .attr("id", (d) => d.id as string);

    // Make nodes for empty nodes
    g.selectAll("circle")
      .data(data)
      .enter()
      .filter((d) => !d.data.code)
      .append("circle")
      .style("fill", "gray")
      .style("stroke", "black")
      .attr("r", emptyNodeRadius)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .text((d) => d.id as string);

    // Add text inside of nodes
    g.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.data.code ?? "")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + emptyNodeRadius)
      .attr("text-anchor", "middle")
      .attr("stroke", "#000");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);
  return <svg id="course-graph"></svg>;
};

export default CourseRelationTree;
