import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { login, authenticated } = usePrivy();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-gray-900" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Provable Knowledge OnChain
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Unlock the power of verified insights with Provable Knowledge
            OnChain – a revolutionary marketplace where premium, tokenized
            knowledge graphs and AI-driven data converge for effortless
            integration and next-gen innovation.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {!authenticated ? (
            <Button
              onClick={login}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/graph")}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              View Knowledge Graph
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
