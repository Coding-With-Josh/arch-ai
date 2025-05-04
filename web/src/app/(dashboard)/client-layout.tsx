"use client"

import { SignInButton } from '@/components/navbar/sign-in-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import '@/styles/globals.css';
import { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Sidebar from './_components/Sidebar';
import Navbar from './_components/Navbar';
import { usePathname } from 'next/navigation';
import { useTabs } from "@/components/useTabs";
import { TransitionGroupTabs } from "@/components/transition-group";
import AnimatedTabs from './_components/tab-nav';
import { CommandCenter } from './_components/command';
import { motion } from 'framer-motion';

function ClientLayout({
    session,
    children,
    workspaces
}: {
    children: React.ReactNode, 
    session: Session | null, 
    workspaces: any
}) {
    const pathname = usePathname()
    const isCreatePage = pathname === "/~/create/workspace" || pathname === "/~/create/project"
    const isChoosePage = pathname === "/~/choose-workspace"

    // Debugging logs (remove in production)
    console.log('Rendering ClientLayout', {
        session,
        pathname,
        isCreatePage,
        isChoosePage
    })

    if (!session) {
        return (
            <div className='flex items-center justify-center h-screen w-screen z-[5000]'>
                <Dialog open>
                    <DialogContent className="sm:max-w-[500px] border-zinc-800 bg-zinc-900/90 backdrop-blur-sm">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-zinc-100">Not Authenticated</DialogTitle>
                            <p className="text-sm text-zinc-400">
                                You are not authenticated. Please sign in to continue.
                            </p>
                        </DialogHeader>
                        <SignInButton />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    if (isCreatePage) {
        return (
            <div className="flex min-h-screen w-screen bg-background overflow-hidden">
                {children}
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-background overflow-hidden">
            {/* Always show Navbar for authenticated users except on create pages */}
            <Navbar session={session} workspaces={workspaces} />

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Show Sidebar unless on choose page */}
                {!isChoosePage && <Sidebar />}

                {/* Content area */}
                <div className="flex-1 overflow-auto">
                    <main className="flex flex-1 flex-col gap-4 p-4 w-full md:gap-8 md:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col gap-4"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
            
            {/* Command center (assuming this should always be available) */}
            <CommandCenter />
        </div>
    )
}

export default ClientLayout