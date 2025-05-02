import '@/styles/globals.css';

import { Navbar } from '@/components/landing/nav';
import { Footer } from '@/components/landing/footer';
import { auth } from '../api/auth/[...nextauth]/auth-options';
import prisma from "@/lib/prisma";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [

    ],
});

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
    name: "Arch",
    description: "Arch",
    url: "https://arch-ai-dev.vercel.app",
    icons: ["../assets/brand/arch-logo.jpg"],
};

createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana, solanaTestnet, solanaDevnet],
    metadata,
    projectId,
    features: {
        analytics: true,
    },
});

async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userWithWorkspaces = await prisma.user.findUnique({
    where: { id: session?.user.id },
    include: {
      workspaces: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });

  const activeWorkspace = userWithWorkspaces?.workspaces[0];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar session={session} activeWorkspace={activeWorkspace} />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
