import { readClient } from "@/lib/contract/client";
import {
  blindBoxABI,
  ippyIPABI,
  blindBoxAddress,
  ippyNFTAddress,
} from "@/lib/contract";

// BlindBox Read Functions

// Get BlindBox Info
export const getContractInfo = () => {
  const blindBoxInfo = readClient.readContract({
    address: blindBoxAddress,
    abi: blindBoxABI,
    functionName: "getContractInfo",
  });

  return blindBoxInfo;
};

// Get User BlindBox Balance - Fixed to include address parameter
export const getUserBlindBoxBalance = (address: `0x${string}`) => {
  const userBlindBoxBalance = readClient.readContract({
    address: blindBoxAddress,
    abi: blindBoxABI,
    functionName: "getUserBoxBalance", // Match the actual contract function name
    args: [address],
  });

  return userBlindBoxBalance;
};

// IPPYNFT Read Functions

export const getUserNFTs = (address: `0x${string}`) => {
  const userNFTs = readClient.readContract({
    address: ippyNFTAddress,
    abi: ippyIPABI,
    functionName: "getUserNFTs",
    args: [address],
  });

  return userNFTs;
};

export const getUserNFTTypeCounts = (address: `0x${string}`) => {
  const userNFTTypeCounts = readClient.readContract({
    address: ippyNFTAddress,
    abi: ippyIPABI,
    functionName: "getUserNFTTypeCounts",
    args: [address],
  });

  return userNFTTypeCounts;
};

export const getUserOwnsHiddenNFT = (address: `0x${string}`) => {
  const userOwnsHiddenNFT = readClient.readContract({
    address: ippyNFTAddress,
    abi: ippyIPABI,
    functionName: "userOwnsHiddenNFT", // Match the actual contract function name
    args: [address],
  });

  return userOwnsHiddenNFT;
};

export const getTotalSupply = () => {
  const totalSupply = readClient.readContract({
    address: ippyNFTAddress,
    abi: ippyIPABI,
    functionName: "totalSupply",
  });

  return totalSupply;
};

// Add missing contract read functions
export const getGlobalNFTStats = () => {
  const globalStats = readClient.readContract({
    address: ippyNFTAddress,
    abi: ippyIPABI,
    functionName: "getGlobalNFTStats",
  });

  return globalStats;
};

export const getProbabilityInfo = () => {
  const probabilityInfo = readClient.readContract({
    address: blindBoxAddress,
    abi: blindBoxABI,
    functionName: "getProbabilityInfo",
  });

  return probabilityInfo;
};
