"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { storyAeneid } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: "light",
                    accentColor: "#676FFF",
                    logo: "/story-logo.jpg",
                    walletList: ['rabby_wallet', 'metamask', 'rainbow', 'zerion', 'okx_wallet', 'wallet_connect']
                },
                // Create embedded wallets for users who don't have a wallet
                // when they sign in with email
                embeddedWallets: {
                    createOnLogin: "all-users",
                },
                defaultChain: storyAeneid,
                supportedChains: [storyAeneid],
            }}
        >
            <SmartWalletsProvider>{children}</SmartWalletsProvider>
        </PrivyProvider>
    );
}