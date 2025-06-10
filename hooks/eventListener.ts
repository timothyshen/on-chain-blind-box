import { contractEvent } from "viem";
import { blindBoxABI } from "@/lib/contract";

export const listenToBlindBoxEvents = (address: string) => {
  const blindBoxEvents = contractEvent({
    address: address,
    abi: blindBoxABI,
    eventName: "BlindBoxOpened",
  });

  return blindBoxEvents;
};
