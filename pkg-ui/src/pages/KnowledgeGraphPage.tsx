import { useCallback, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, LogOut } from "lucide-react";
import { nodes, relationships } from "@/data";

// Sample knowledge graphs data
const knowledgeGraphs = [
  {
    id: 1,
    name: "Blockchain Concepts",
    description: "Core blockchain technology concepts and relationships",
  },
  {
    id: 2,
    name: "DeFi Ecosystem",
    description: "Decentralized finance protocols and connections",
  },
  {
    id: 3,
    name: "NFT Landscape",
    description: "NFT marketplaces, standards, and use cases",
  },
  {
    id: 4,
    name: "Web3 Infrastructure",
    description: "Web3 development tools and frameworks",
  },
];

// Sample graph data for the selected graph
let graphData = {
  nodes: nodes,
  links: relationships,
};
// const graphData = {
//   nodes: [
//     { id: "concept1", name: "Blockchain", group: 1 },
//     { id: "concept2", name: "Smart Contracts", group: 1 },
//     { id: "concept3", name: "DeFi", group: 2 },
//     { id: "concept4", name: "NFTs", group: 2 },
//     { id: "concept5", name: "Web3", group: 3 },
//   ],
//   links: [
//     { source: "concept1", target: "concept2" },
//     { source: "concept1", target: "concept3" },
//     { source: "concept2", target: "concept4" },
//     { source: "concept3", target: "concept5" },
//   ],
// };
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
  const [graphWidth, setGraphWidth] = useState(window.innerWidth - 300);
  const [graphHeight, setGraphHeight] = useState(window.innerHeight);
  const [selectedGraphId, setSelectedGraphId] = useState<number | null>(1);
  const categoryColorMap = createCategoryColorMap(graphData.nodes);

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
                onClick={() => setSelectedGraphId(graph.id)}
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
          graphData={graphData}
          width={graphWidth}
          height={graphHeight}
          nodeLabel="label"
          nodeAutoColorBy={(node) => {
            const category = node.data?.category;
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
