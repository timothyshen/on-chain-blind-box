import { readClient } from "@/lib/contract/client";
import { blindBoxABI, ippyIPABI } from "@/lib/contract";

// BlindBox Read Functions

// Get BlindBox Info
export const getContractInfo = () => {
  const blindBoxInfo = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: blindBoxABI,
    functionName: "getContractInfo",
  });

  return blindBoxInfo;
};

// Get User BlindBox Balance
export const getUserBlindBoxBalance = () => {
  const userBlindBoxBalance = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: blindBoxABI,
    functionName: "getUserBlindBoxBalance",
  });

  return userBlindBoxBalance;
};

// IPPYNFT Read Functions

export const getUserNFTs = (address: string) => {
  const userNFTs = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "getUserNFTs",
  });

  return userNFTs;
};

export const getUserNFTTypeCounts = (address: string) => {
  const userNFTTypeCounts = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "getUserNFTTypeCounts",
  });

  return userNFTTypeCounts;
};

export const getUserOwnsHiddenNFT = (address: string) => {
  const userOwnsHiddenNFT = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "getUserOwnsHiddenNFT",
  });

  return userOwnsHiddenNFT;
};

export const getTotalSupply = () => {
  const totalSupply = readClient.readContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "totalSupply",
  });

  return totalSupply;
};
