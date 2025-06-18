import {
  blindBoxABI,
  readClient,
  useWalletClient,
  blindBoxAddress,
} from "@/lib/contract";
import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useNotifications } from "@/contexts/notification-context";

export const useBlindBox = () => {
  const { getWalletClient } = useWalletClient();
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Get contract information (price, max per tx, etc.)
  const getContractInfo = async () => {
    try {
      const result = await readClient.readContract({
        address: blindBoxAddress,
        abi: blindBoxABI,
        functionName: "getContractInfo",
      });

      const [price, maxPerTx, totalSupply, currentSupply, remainingBoxes] =
        result as [bigint, bigint, bigint, bigint, bigint];

      return {
        price: formatEther(price),
        maxPerTx: Number(maxPerTx),
        totalSupply: Number(totalSupply),
        currentSupply: Number(currentSupply),
        remainingBoxes: Number(remainingBoxes),
      };
    } catch (error) {
      console.error("Error getting contract info:", error);
      throw error;
    }
  };

  // Get user's blind box balance
  const getUserBoxBalance = async (userAddress: string) => {
    try {
      const balance = await readClient.readContract({
        address: blindBoxAddress,
        abi: blindBoxABI,
        functionName: "getUserBoxBalance",
        args: [userAddress],
      });

      return Number(balance);
    } catch (error) {
      console.error("Error getting user balance:", error);
      throw error;
    }
  };

  // Check user's ETH balance
  const checkUserBalance = async (
    userAddress: string,
    requiredAmount: bigint
  ) => {
    try {
      const balance = await readClient.getBalance({
        address: userAddress as `0x${string}`,
      });

      return {
        hasEnough: balance >= requiredAmount,
        balance: formatEther(balance),
        required: formatEther(requiredAmount),
      };
    } catch (error) {
      console.error("Error checking user balance:", error);
      throw error;
    }
  };

  // purchaseBoxes(uint256 amount) payable - Buy blind boxes
  const purchaseBoxes = async (amount: number) => {
    try {
      setIsPurchaseLoading(true);
      addNotification({
        title: "Purchasing boxes...",
        message: `Purchasing ${amount} boxes...`,
        type: "info",
      });
      const walletClient = await getWalletClient();
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      // Get the account address
      const [account] = await walletClient.getAddresses();
      console.log("account", account);
      // Calculate total cost
      const totalCost = parseEther("0.01") * BigInt(amount);

      // First simulate the contract call to ensure it will succeed
      const { request } = await readClient.simulateContract({
        address: blindBoxAddress,
        abi: blindBoxABI,
        functionName: "purchaseBoxes",
        value: totalCost,
        args: [BigInt(amount)],
        account,
      });

      // Then execute the actual transaction
      const txHash = await walletClient.writeContract(request);
      setIsPurchaseLoading(false);
      const tx = await readClient.waitForTransactionReceipt({
        hash: txHash,
      });
      const txLink = `https://aeneid.storyscan.io/tx/${txHash}`;

      addNotification({
        title: "Boxes purchased!",
        message: `You have purchased ${amount} boxes!`,
        type: "success",
        action: {
          label: "View on StoryScan",
          onClick: () => {
            window.open(txLink, "_blank");
          },
        },
        duration: 10000,
      });
      return txHash;
    } catch (error) {
      console.error("Error purchasing boxes:", error);
      throw error;
    }
  };

  // openBoxes(uint256 amount) - Open boxes to reveal NFTs
  const openBoxes = async (amount: number) => {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) {
        throw new Error("No wallet connected");
      }

      // Get the account address
      const [account] = await walletClient.getAddresses();

      // Check if user has enough boxes
      const boxBalance = await getUserBoxBalance(account);
      if (boxBalance < amount) {
        throw new Error(
          `You only have ${boxBalance} boxes but trying to open ${amount}`
        );
      }

      // Execute the transaction directly
      const txHash = await walletClient.writeContract({
        address: blindBoxAddress,
        abi: blindBoxABI,
        functionName: "openBox",
        args: [BigInt(amount)],
        account,
      });

      return txHash;
    } catch (error) {
      console.error("Error opening boxes:", error);
      throw error;
    }
  };

  return {
    purchaseBoxes,
    openBoxes,
    getContractInfo,
    getUserBoxBalance,
    checkUserBalance,
  };
};
