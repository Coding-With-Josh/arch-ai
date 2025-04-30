import React, { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

// Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// Get projectId from https://cloud.reown.com or from environment variables
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID";

// Optional metadata object
const metadata = {
    name: "AppKit",
    description: "AppKit Solana Example",
    url: "https://example.com", // Origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the AppKit provider context component
const AppKitProvider = createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana, solanaTestnet, solanaDevnet],
    metadata,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});

// WalletProvider wraps children with the AppKitProvider
export function WalletProvider({ children }: { children: ReactNode }) {
    return <AppKitProvider>{children}</AppKitProvider>;
}