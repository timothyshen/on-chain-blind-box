import { createPublicClient, createWalletClient, http } from "viem";
import { storyAeneid } from "viem/chains";

export const readClient = createPublicClient({
  chain: storyAeneid,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: storyAeneid,
  transport: http(),
});
