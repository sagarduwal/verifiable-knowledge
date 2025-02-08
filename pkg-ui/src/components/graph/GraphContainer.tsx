import {
  GraphCanvas,
  GraphCanvasRef,
  LayoutTypes,
  useSelection,
  SphereWithIcon,
} from "reagraph";
import { useRef, useState } from "react";
import { nodes, relationships } from "@/data";

const GraphContainer = () => {
  const [layout, _] = useState<LayoutTypes>("forceDirected2d");
  const graphRef = useRef<GraphCanvasRef | null>(null);
  const [graphWidth, setGraphWidth] = useState(window.innerWidth - 300); // 300px for sidebar
  const [graphHeight, setGraphHeight] = useState(window.innerHeight);

  const {
    selections,
    actives,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
  } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: relationships,
    pathSelectionType: "all",
    pathHoverType: "all",
  });
  return (
    <GraphCanvas
      ref={graphRef}
      nodes={nodes}
      edges={relationships}
      labelType="all"
      edgeArrowPosition="end"
      edgeInterpolation="curved"
      selections={selections}
      actives={actives}
      onNodeClick={(node) => {
        console.log(node);
      }}
      onCanvasClick={onCanvasClick}
      onNodePointerOver={onNodePointerOver}
      onNodePointerOut={onNodePointerOut}
      layoutType={layout}
      clusterAttribute="category"
      draggable
      renderNode={({ node, ...rest }) => (
        <SphereWithIcon {...rest} node={node} image={node.icon || ""} />
      )}
    />
  );
};

export default GraphContainer;
