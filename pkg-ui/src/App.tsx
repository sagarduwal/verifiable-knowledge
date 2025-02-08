import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivyProvider } from "@privy-io/react-auth";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import KnowledgeGraphPage from "@/pages/KnowledgeGraphPage";

const PRIVY_APP_ID = "cm6uinnhi026ubiocuagvrveg"; // Replace with your Privy App ID

function App() {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#000000",
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph" element={<KnowledgeGraphPage />} />
        </Routes>
      </Router>
      <Toaster />
    </PrivyProvider>
  );
}

export default App;
