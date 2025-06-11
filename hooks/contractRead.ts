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

// Get User BlindBox Balance
export const getUserBlindBoxBalance = () => {
  const userBlindBoxBalance = readClient.readContract({
    address: blindBoxAddress,
    abi: blindBoxABI,
    functionName: "getUserBlindBoxBalance",
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
    functionName: "getUserOwnsHiddenNFT",
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
