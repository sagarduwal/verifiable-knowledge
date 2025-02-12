# 📖 Verifiable Knowledge Onchain

**Decentralized, Verifiable Knowledge Marketplace**

## Overview

Verifiable Knowledge Onchain is a **marketplace for verifiable, purchasable knowledge graphs (KGs)**, allowing developers, AI agents, and decentralized applications to **store, trade, and integrate structured knowledge onchain**. It enables **encrypted access, AI-driven interactions, and Web3 integrations**, making decentralized knowledge easily accessible for various applications.

## 🌟 Features

- **Decentralized Knowledge Marketplace**: Buy, sell, and integrate structured knowledge graphs for AI models, dApps, and research.
- **Immutable & Tokenized Storage**: Knowledge graphs are **stored on-chain**, with smart contracts governing ownership and access.
- **Secure & Shareable Encryption**: Uses **Lit Protocol** for encrypted access control, ensuring only authorized users can decrypt data.
- **AI & Agent Integration**: Enables AI-driven bots, metaverse assistants, and intelligent applications to interact with structured knowledge.
- **Onchain & Offchain Interactions**: Data can be used for onchain transactions, smart contracts, or offline analysis.
- **Web3 & DeFi Compatibility**: Supports **Retrieval-Augmented Generation (RAG), Deepseek, and DeFi** for seamless transactions and monetization of knowledge assets.


**Video Intro:** https://youtu.be/niJYS6Qs7Lo

---

## 🏪 Knowledge Graph Marketplace

Developers, researchers, and businesses can **publish and monetize their structured knowledge** on the marketplace, enabling access for:

- **AI Training & Fine-tuning**: Verified datasets for LLMs, RAG models, and AI assistants.
- **Decentralized Applications**: Smart contracts and dApps needing structured, trustless knowledge.
- **Metaverse & Gaming**: AI-powered NPCs, contextual in-game knowledge, and interactive storytelling.
- **Web3 Social & Identity**: Reputation-based KGs for DAOs, verifiable credentials, and decentralized social networks.

### 📦 How It Works

1. **Upload Knowledge Graphs**: Users can contribute structured data in the form of **graphs, documents, or models**.
2. **Tokenized Access**: Smart contracts enforce permissions and payments for **on-demand access or full ownership**.
3. **Encrypted Storage**: **Lit Protocol** ensures secure access to knowledge, granting selective decryption.
4. **AI & Application Integration**: Use knowledge graphs in **AI agents, Web3 applications, and decentralized systems**.

---

## 🛠 Tech Stack

| Technology              | Purpose                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **Langchain/Langgraph** | Processes natural language inputs & structures them into a dynamic knowledge graph.          |
| **Neo4j**               | Graph database for efficient querying and knowledge storage.                                 |
| **Lit Protocol**        | Decentralized key management for encrypting/decrypting data with shareable access.           |
| **Privy**               | Ensures user privacy & compliance with automated privacy controls.                           |
| **Privy**               | Decentralized blob storage with availability proofs, leveraging Sui for scalability.         |
| **DeFi & RAG**          | Supports retrieval-augmented generation & automated transactions for knowledge monetization. |

---

## 🚀 Quick Start

### 🐳 Running Neo4j with Docker

```sh
docker run --publish=7474:7474 --publish=7687:7687 \
--volume=$HOME/neo4j/data:/data --env='NEO4JLABS_PLUGINS=["apoc"]' neo4j


```

### 📂 Sample Files

- [altlayer.txt](https://data-lake-demo-23.s3.us-east-2.amazonaws.com/altlayer.txt)
- [ethglobal.txt](https://data-lake-demo-23.s3.us-east-2.amazonaws.com/ethglobal.txt)
- [example.txt](https://data-lake-demo-23.s3.us-east-2.amazonaws.com/example.txt)
- [lit-protocol.txt](https://data-lake-demo-23.s3.us-east-2.amazonaws.com/lit-protocol.txt)
- [walrus.txt](https://data-lake-demo-23.s3.us-east-2.amazonaws.com/walrus.txt)

### 📜 Cypher Queries

Export all data:

```cypher
CALL apoc.export.cypher.all(null, {format: "create", stream: true}) YIELD cypherStatements
RETURN cypherStatements
```

Query for a specific document ID:

```cypher
CALL apoc.export.cypher.query(
  "MATCH (n)
   WHERE 'abc2' IN n.document_id
   OPTIONAL MATCH (n)-[r]-(m)
   WHERE m IS NULL OR 'abc' IN m.document_id
   RETURN n, r, m",
  null,
  {format: 'create', stream: true}
) YIELD cypherStatements
RETURN cypherStatements
```

---

## 📌 TODO

- [x] **Simple UI** for interacting with the Knowledge Graph.
- [x] **Wallet-based encryption** using **Lit Protocol** for private user data.
- [ ] **Marketplace smart contracts** for tokenized knowledge access & sales.

---

## 🔗 References

- [OriginTrail DKG Intro](https://docs.origintrail.io/dkg-v6-previous-version/dkgintro)
- [Cluster Protocol](https://x.com/ClusterProtocol/status/1882896033988096286)

---

## 🔥 Built For

- **AI & Machine Learning**: Access structured, verified training data.
- **Decentralized Applications**: Use tokenized knowledge in smart contracts.
- **Metaverse & Web3 Social**: Build context-aware AI-powered interactions.
- **Knowledge Monetization**: Sell and distribute structured knowledge graphs.

🎯 **VeriKnowledgeOnchain brings decentralized, verifiable knowledge to the blockchain, enabling AI-driven insights, private data storage, and a marketplace for tokenized knowledge.** 🚀
