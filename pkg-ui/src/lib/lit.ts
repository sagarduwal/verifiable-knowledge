// import { LitNodeClient } from "@lit-protocol/lit-node-client";
// import { LIT_NETWORK } from "@lit-protocol/constants";
// import * as LitJsSdk from "@lit-protocol/lit-node-client";
// import { encryptToJson } from "@lit-protocol/encryption";

// import {
//   createSiweMessage,
//   generateAuthSig,
//   LitAbility,
//   LitAccessControlConditionResource,
// } from "@lit-protocol/auth-helpers";

// import { AccessControlConditions } from "@lit-protocol/types";
// import { ethers } from "ethers";

// // Initialize the LitNodeClient
// let litNodeClient: LitNodeClient;

// export const getLitNodeClient = async () => {
//   const litNodeClient = new LitNodeClient({
//     alertWhenUnauthorized: false,
//     litNetwork: LIT_NETWORK.DatilDev,
//     debug: true,
//   });
//   await litNodeClient.connect();
//   return litNodeClient;
// };

// async function connect() {
//   litNodeClient = new LitNodeClient({
//     alertWhenUnauthorized: false,
//     debug: false,
//     litNetwork: LIT_NETWORK.DatilDev,
//   });
//   await litNodeClient.connect();
// }

// const encryptString = async (connectedAddress: string, str: string) => {
//   litNodeClient = await getLitNodeClient();

//   // if (!litNodeClient) {
//   //   await connect();
//   // }
//   // const authSig = await LitJsSdk.checkAndSignAuthMessage({
//   //   chain: "ethereum",
//   //   nonce: "1",
//   // });

//   const accessControlConditions: AccessControlConditions = [
//     {
//       contractAddress: "0xA474d1C455058EaB59DdA82A5C7321b1e21Cd63b",
//       standardContractType: "",
//       chain: "baseSepolia",
//       method: "balanceOf",
//       parameters: [":account", connectedAddress, ":id", "1"],
//       returnValueTest: {
//         comparator: ">=",
//         value: "0",
//       },
//     },
//   ];

//   const { ciphertext, dataToEncryptHash } = await litNodeClient.encryptString({
//     dataToEncrypt: new TextEncoder().encode(str),
//     accessControlConditions,
//   });

//   return {
//     ciphertext,
//     dataToEncryptHash,
//   };
// };

// async function decryptString(
//   connectedAddress: string,
//   ciphertext: Uint8Array,
//   dataToEncryptHash: string
// ) {
//   if (!litNodeClient) {
//     await connect();
//   }

//   const sessionSignatures = await litNodeClient.getSessionSigs({
//     chain: "ethereum",
//     expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
//     resourceAbilityRequests: [
//       {
//         resource: new LitAccessControlConditionResource("*"),
//         ability: LitAbility.AccessControlConditionDecryption,
//       },
//     ],
//     authNeededCallback: async ({
//       uri,
//       expiration,
//       resourceAbilityRequests,
//     }) => {
//       const toSign = await createSiweMessage({
//         uri,
//         expiration,
//         resources: resourceAbilityRequests,
//         walletAddress: connectedAddress,
//         nonce: await litNodeClient.getLatestBlockhash(),
//         litNodeClient,
//       });
//       const provider = new ethers.providers.JsonRpcProvider(
//         "https://base-sepolia.g.alchemy.com/v2/Your-API-Key"
//       );
//       const signer = provider.getSigner(connectedAddress);

//       return await generateAuthSig({
//         signer: signer,
//         toSign,
//       });
//     },
//   });

//   const accessControlConditions = [
//     {
//       contractAddress: "0xA474d1C455058EaB59DdA82A5C7321b1e21Cd63b",
//       standardContractType: "",
//       chain: "baseSepolia",
//       method: "balanceOf",
//       parameters: [":account", connectedAddress, ":id", "1"],
//       returnValueTest: {
//         comparator: ">=",
//         value: "0",
//       },
//     },
//   ];

//   const decryptionResponse = await litNodeClient.decrypt({
//     chain: "ethereum",
//     sessionSigs: sessionSignatures,
//     ciphertext,
//     dataToEncryptHash,
//     accessControlConditions,
//   });

//   const decryptedString = new TextDecoder().decode(
//     decryptionResponse.decryptedData
//   );

//   return decryptedString;
// }

// import { encryptString, encryptToJson } from "@lit-protocol/encryption";
import { AccessControlConditions } from "@lit-protocol/types";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import {
  LitNodeClientConfig,
  EncryptStringRequest,
  ILitNodeClient,
  EncryptToJsonProps,
} from "@lit-protocol/types";

export const getLitNodeClient = async (): Promise<LitNodeClient> => {
  const litNodeClientConfig: LitNodeClientConfig = {
    alertWhenUnauthorized: false,
    litNetwork: "datil-dev",
    debug: true,
  };
  const litNodeClient = new LitNodeClient(litNodeClientConfig);
  await litNodeClient.connect();
  return litNodeClient;
};

// Allow users owning any NFT from a contract
function getAccessControlConditions(): object[] {
  return [
    {
      contractAddress: "0xABC123...XYZ", // ERC721 contract address
      standardContractType: "ERC721",
      chain: "ethereum",
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
}

async function encryptData(
  connectedAddress: string,
  dataToEncrypt: string
): Promise<[string, string]> {
  // const accessControlConditions = getAccessControlConditions();
  const litNodeClient: ILitNodeClient = await getLitNodeClient();

  console.log(connectedAddress);

  const accessControlConditions: AccessControlConditions = [
    {
      contractAddress: "0xA474d1C455058EaB59DdA82A5C7321b1e21Cd63b",
      standardContractType: "",
      chain: "baseSepolia",
      method: "balanceOf",
      parameters: [":account", connectedAddress, ":id", "1"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];

  const { ciphertext, dataToEncryptHash } = await litNodeClient.encrypt({
    dataToEncrypt: new TextEncoder().encode(dataToEncrypt),
    accessControlConditions,
  });

  return [ciphertext, dataToEncryptHash];
}

// async function encryptFile(file: File | Blob) {
//   if (!litNodeClient) {
//     await connect();
//   }

//   // Convert file to array buffer
//   const arrayBuffer = await file.arrayBuffer();
//   const fileBytes = new Uint8Array(arrayBuffer);

//   const authSig = await LitJsSdk.checkAndSignAuthMessage({
//     chain: "ethereum",
//   });

//   const accessControlConditions = [
//     {
//       contractAddress: "",
//       standardContractType: "",
//       chain: "ethereum",
//       method: "eth_getBalance",
//       parameters: [":userAddress", "latest"],
//       returnValueTest: {
//         comparator: ">=",
//         value: "0",
//       },
//     },
//   ];

//   const encryptedZip = await litNodeClient.encryptFileAndZipWithMetadata({
//     file: fileBytes,
//     accessControlConditions: accessControlConditions,
//     authSig,
//     chain: "ethereum",
//     litNodeClient: litNodeClient,
//   });

//   const encryptedBlob = new Blob([encryptedZip], { type: "text/plain" });
//   const fileName = file instanceof File ? file.name : `idfa-${Date.now()}`;
//   const encryptedFile = new File([encryptedBlob], fileName);

//   const walrusResponse = await fetch(
//     "https://publisher.walrus-testnet.walrus.space/v1/blobs",
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/octet-stream",
//       },
//       body: encryptedFile,
//     }
//   );

//   if (!walrusResponse.ok) {
//     throw new Error("Failed to store data with Walrus publisher");
//   }

//   const walrusResult = await walrusResponse.json();
//   console.log(
//     "Stored with Walrus, blob ID:",
//     walrusResult.newlyCreated.blobObject.blobId
//   );

//   return {
//     encryptedFile,
//     accessControlConditions,
//   };
// export { connect, encryptString, decryptString }
export { encryptData };
