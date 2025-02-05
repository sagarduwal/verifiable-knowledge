import { LIT_NETWORK } from "@lit-protocol/constants";
import LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

let litNodeClient;

async function connectToLitNetwork() {
  litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
    alertWhenUnauthorized: false,
    litNetwork: LIT_NETWORK.DatilDev // LIT_NETWORK.Datil, LIT_NETWORK.DatilDev, LIT_NETWORK.DatilTest
  });

  try {
    await litNodeClient.connect();
    console.log("Connected to the Lit Network successfully!");
  } catch (error) {
    console.error("Failed to connect to the Lit Network:", error);
  }
}

async function disconnectFromNetwork() {
  try {
    await litNodeClient.disconnect();
    console.log("Disconnected from the Lit Network successfully!");
  } catch (error) {
    console.error("Failed to disconnect from the Lit Network:", error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await connectToLitNetwork();
  await sleep(5000); // Sleep for 5 seconds
  await disconnectFromNetwork();
}

main();
