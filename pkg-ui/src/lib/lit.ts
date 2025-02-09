import { LitNodeClient } from "@lit-protocol/lit-node-client";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

class Lit {
  private litNodeClient: LitNodeClient;

  async connect() {
    this.litNodeClient = new LitNodeClient({
      alertWhenUnauthorized: false,
      debug: false,
    });
    await this.litNodeClient.connect();
  }

  async encryptString(str: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
    });

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: "ethereum",
    });

    return {
      encryptedString,
      encryptedSymmetricKey,
    };
  }

  async encryptFile(file: File | Blob) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
    });

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];

    const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
      file: fileBytes,
      accessControlConditions: accessControlConditions,
      authSig,
      chain: "ethereum",
      litNodeClient: this.litNodeClient,
    });

    const encryptedBlob = new Blob([encryptedZip], { type: "text/plain" });
    const fileName = file instanceof File ? file.name : `idfa-${Date.now()}`;
    const encryptedFile = new File([encryptedBlob], fileName);

    const walrusResponse = await fetch(
      "https://publisher.walrus-testnet.walrus.space/v1/blobs",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: encryptedFile,
      }
    );

    if (!walrusResponse.ok) {
      throw new Error("Failed to store data with Walrus publisher");
    }

    const walrusResult = await walrusResponse.json();
    console.log(
      "Stored with Walrus, blob ID:",
      walrusResult.newlyCreated.blobObject.blobId
    );

    return {
      encryptedFile,
      // encryptedSymmetricKey: Buffer.from(encryptedSymmetricKey).toString("hex"),
      accessControlConditions,
    };
  }
}

export const litClient = new Lit();
