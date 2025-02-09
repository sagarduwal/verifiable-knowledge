import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";

export default function HomePage() {
  const { login, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { setWalletData } = useWallet();
  const handleLogin = async () => {
    await login();
    setWalletData(user); // Store wallet data in context
  };
  return (
    <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Brain className="mx-auto h-12 w-12 text-gray-900" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Verifiable Knowledge OnChain
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Unlock the power of verified insights with Verifiable Knowledge
                OnChain – a revolutionary marketplace where premium, tokenized
                knowledge graphs and AI-driven data converge for effortless
                integration and next-gen innovation.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              {!authenticated ? (
                <Button
                  onClick={handleLogin}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Connect Wallet
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/graph")}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    View Knowledge Graph
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Connected Wallet: {user?.wallet?.address}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-1/2  justify-center">
        <img
          src="bg.jpg"
          alt="Description of image"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
