import { useCallback, useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, LogOut } from "lucide-react";

// import { nodes as g1_nodes, relationships as g1_links } from "@/data/graphData";
// import {
//   nodes as g2_nodes,
//   relationships as g2_links,
// } from "@/data/graphData1";

// Sample knowledge graphs data
const knowledgeGraphs = [
  {
    id: "abc", //"eth-global-1",
    name: "ETHGlobal",
    description:
      "Supporting Ethereum hackathons worldwide to grow and empower the developer community.",
  },
  {
    id: "abc2", //"altlayer-protocol-2",
    name: "AltLayer Protocol",
    description:
      "Decentralized rollup protocol enhancing security, finality, and interoperability with Restaked rollups and no-code RaaS.",
  },
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to create a color map for categories
const createCategoryColorMap = (nodes): Record<string, string> => {
  const categoryColorMap: Record<string, string> = {};
  nodes.forEach((node) => {
    const category = node.data?.category;
    if (category && !categoryColorMap[category]) {
      categoryColorMap[category] = getRandomColor();
    }
  });
  return categoryColorMap;
};

export default function KnowledgeGraphPage() {
  const { logout } = usePrivy();
  const navigate = useNavigate();
  const graphRef = useRef<any>(null);

  const [graphWidth, setGraphWidth] = useState(window.innerWidth - 300);
  const [graphHeight, setGraphHeight] = useState(window.innerHeight);
  const [selectedGraphId, setSelectedGraphId] = useState<string | null>("abc");
  const [gData, setGData] = useState({ nodes: [], links: [] });
  const categoryColorMap = createCategoryColorMap(gData.nodes);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleResize = useCallback(() => {
    setGraphWidth(window.innerWidth - 300);
    setGraphHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.zoom(2); // Adjust the zoom level as needed
    }
  }, [gData]);

  useEffect(() => {
    const fetchGraphData = async (graphId: string) => {
      try {
        const response = await fetch(
          `http://0.0.0.0:8005/api/v1/graph/${graphId}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);
        setGData({
          nodes: result.data?.nodes || [],
          links: result.data?.relationships || [],
        });
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setGData({ nodes: [], links: [] }); // Fallback to empty graph on error
      }
    };

    if (selectedGraphId) {
      fetchGraphData(selectedGraphId);
    }
  }, [selectedGraphId]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[300px] border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Knowledge Graphs</h2>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {knowledgeGraphs.map((graph) => (
              <button
                key={graph.id}
                onClick={() => {
                  setSelectedGraphId(graph.id);
                  console.log("graph Id: ", graph.id);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedGraphId === graph.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <h3 className="font-medium">{graph.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {graph.description}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1">
        <ForceGraph2D
          ref={graphRef}
          graphData={gData}
          width={graphWidth}
          height={graphHeight}
          nodeLabel="label"
          nodeAutoColorBy={(node) => {
            const category = node?.data?.category;
            return categoryColorMap[category] || "#999999";
          }}
          linkColor={() => "#999"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            );

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            ctx.fillText(label, node.x, node.y);
          }}
        />
      </div>
    </div>
  );
}
