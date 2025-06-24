"use client";
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  Hex,
} from "viem";
import "viem/window";
import { storyAeneid } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";

export const readClient = createPublicClient({
  chain: storyAeneid,
  transport: http(),
});

export function useWalletClient() {
  const { wallets } = useWallets();
  const { user } = usePrivy();

  const getWalletClient = async () => {
    try {
      if (!wallets || wallets.length === 0) {
        console.log("No wallet connected");
        return null;
      }
      const currentWallet = user?.wallet?.address;
      const wallet = wallets.find((wallet) => wallet.address === currentWallet);
      if (!wallet) {
        console.log("No wallet found");
        return null;
      }
      console.log("wallet", wallet);
      const provider = await wallet.getEthereumProvider();

      const walletClient = createWalletClient({
        chain: storyAeneid,
        transport: custom(provider),
      });
      console.log("walletClient", walletClient);
      return walletClient;
    } catch (error) {
      console.error("Error getting wallet client:", error);
      throw error;
    }
  };

  return { getWalletClient };
}
