import { walletClient, ippyIPABI } from "@/lib/contract";

export const useIPPYIP = () => {
  //transferFrom(address, address, uint256) - Transfer NFTs
  //approve(address, uint256) - Approve transfers
  //setApprovalForAll(address, bool) - Approve all NFTs

  const transferFrom = walletClient.writeContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "transferFrom",
  });

  const approve = walletClient.writeContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "approve",
  });

  const setApprovalForAll = walletClient.writeContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: ippyIPABI,
    functionName: "setApprovalForAll",
  });

  return { transferFrom, approve, setApprovalForAll };
};
