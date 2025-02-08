import { GraphData } from '@/types/graph';

export const knowledgeGraphs = [
  { id: 1, name: 'Blockchain Concepts', description: 'Core blockchain technology concepts and relationships' },
  { id: 2, name: 'DeFi Ecosystem', description: 'Decentralized finance protocols and connections' },
  { id: 3, name: 'NFT Landscape', description: 'NFT marketplaces, standards, and use cases' },
  { id: 4, name: 'Web3 Infrastructure', description: 'Web3 development tools and frameworks' },
];

export const graphsData: Record<number, GraphData> = {
  1: {
    nodes: [
      { id: 'concept1', name: 'Blockchain', group: 1 },
      { id: 'concept2', name: 'Smart Contracts', group: 1 },
      { id: 'concept3', name: 'DeFi', group: 2 },
      { id: 'concept4', name: 'NFTs', group: 2 },
      { id: 'concept5', name: 'Web3', group: 3 },
    ],
    links: [
      { source: 'concept1', target: 'concept2' },
      { source: 'concept1', target: 'concept3' },
      { source: 'concept2', target: 'concept4' },
      { source: 'concept3', target: 'concept5' },
    ],
  },
  2: {
    nodes: [
      { id: 'defi1', name: 'Lending', group: 1 },
      { id: 'defi2', name: 'DEX', group: 1 },
      { id: 'defi3', name: 'Yield Farming', group: 2 },
      { id: 'defi4', name: 'Staking', group: 2 },
    ],
    links: [
      { source: 'defi1', target: 'defi2' },
      { source: 'defi2', target: 'defi3' },
      { source: 'defi3', target: 'defi4' },
    ],
  },
  3: {
    nodes: [
      { id: 'nft1', name: 'ERC-721', group: 1 },
      { id: 'nft2', name: 'ERC-1155', group: 1 },
      { id: 'nft3', name: 'Marketplaces', group: 2 },
      { id: 'nft4', name: 'Gaming', group: 2 },
    ],
    links: [
      { source: 'nft1', target: 'nft3' },
      { source: 'nft2', target: 'nft3' },
      { source: 'nft3', target: 'nft4' },
    ],
  },
  4: {
    nodes: [
      { id: 'web31', name: 'RPC Nodes', group: 1 },
      { id: 'web32', name: 'IPFS', group: 1 },
      { id: 'web33', name: 'Wallets', group: 2 },
      { id: 'web34', name: 'dApps', group: 2 },
    ],
    links: [
      { source: 'web31', target: 'web34' },
      { source: 'web32', target: 'web34' },
      { source: 'web33', target: 'web34' },
    ],
  },
};