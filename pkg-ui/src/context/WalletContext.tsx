import { createContext, useContext, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = "cm6uinnhi026ubiocuagvrveg"; // Replace with your Privy App ID

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);

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
      <WalletContext.Provider value={{ walletData, setWalletData }}>
        {children}
      </WalletContext.Provider>
    </PrivyProvider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
