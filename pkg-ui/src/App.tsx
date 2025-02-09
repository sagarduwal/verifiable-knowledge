import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import KnowledgeGraphPage from "@/pages/KnowledgeGraphPage";
import { WalletProvider } from "@/context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph" element={<KnowledgeGraphPage />} />
        </Routes>
      </Router>
      <Toaster />
    </WalletProvider>
  );
}

export default App;
