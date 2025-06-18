"use client";
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  Hex,
} from "viem";
import { storyAeneid } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";

export const readClient = createPublicClient({
  chain: storyAeneid,
  transport: http(),
});

export function useWalletClient() {
  const { wallets } = useWallets();

  const getWalletClient = async () => {
    try {
      if (!wallets || wallets.length === 0) {
        console.log("No wallet connected");
        return null;
      }

      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: wallet.address as Hex,
        chain: storyAeneid,
        transport: custom(provider),
      });

      return walletClient;
    } catch (error) {
      console.error("Error getting wallet client:", error);
      throw error;
    }
  };

  return { getWalletClient };
}
