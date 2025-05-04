import React, { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
    name: "Arch",
    description: "Arch",
    url: "https://arch-ai-dev.vercel.app",
    icons: ["../assets/brand/arch-logo.jpg"],
};

const AppKitProvider = createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana, solanaTestnet, solanaDevnet],
    metadata,
    projectId,
    features: {
        analytics: true,
    },
});
