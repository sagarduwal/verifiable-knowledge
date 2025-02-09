import { useCallback, useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, LogOut, Plus, Loader2, TicketX } from "lucide-react";
import { litClient } from "@/lib/lit";
import { toast } from "sonner";

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
      "Decentralized rollup protocol enhancing security, finality, and interoperabithat clity with Restaked rollups and no-code RaaS.",
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
  const [isGenerating, setIsGenerating] = useState(false);
  const categoryColorMap = createCategoryColorMap(gData.nodes);

  const [documentId, setDocumentId] = useState("");
  const [documentLink, setDocumentLink] = useState("");

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

  const generateKnowledgeGraph = async (id: string, url: string) => {
    try {
      setIsGenerating(true);

      // Request to generate knowledge graph
      const response = await fetch("http://0.0.0.0:8005/api/v1/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: id,
          url: url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate graph data");
      }

      toast.success("Knowledge Graph Generated", {
        description:
          "Graph has been generated, encrypted, and stored with Walrus.",
      });
    } catch (error) {
      console.error("Error generating graph:", error);
      toast.error("Failed to generate knowledge graph");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <div className="p-2 space-y-2 border border-gray-300 rounded-md shadow-sm">
          <div className="flex items-center space-x-1">
            <input
              type="text"
              placeholder="Document ID"
              className="w-full p-1 border rounded"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
            />
            <Button
              onClick={() =>
                setDocumentId(Math.random().toString(36).substring(2, 15))
              }
              className="p-1 border rounded"
              size="sm"
            >
              <TicketX className="h-4 w-4" />
            </Button>
          </div>

          <input
            type="text"
            placeholder="Link to File"
            className="w-full p-1 border rounded"
            onChange={(e) => setDocumentLink(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => generateKnowledgeGraph(documentId, documentLink)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center">
                <Plus className="h-4 w-4" />
                <span className="ml-1">Generate KG from Link</span>
              </div>
            )}
          </Button>
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
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the parent button's onClick from firing
                      // Add your encryption logic here
                      console.log(
                        "Encrypting JSON string for graph:",
                        graph.id
                      );
                    }}
                    className="flex-1 p-1 text-xs bg-transparent hover:bg-gray-100 hover:text-black hover:border-black text-center flex justify-center items-center border border-white rounded-sm"
                  >
                    Encrypt & Upload
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the parent button's onClick from firing
                      // Add your decryption logic here
                      console.log(
                        "Decrypting JSON string for graph:",
                        graph.id
                      );
                    }}
                    className="flex-1 p-1 text-xs bg-transparent hover:bg-gray-100 hover:text-black hover:border-black text-center flex justify-center items-center border border-white rounded-sm"
                  >
                    Decrypt
                  </button>
                </div>
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
