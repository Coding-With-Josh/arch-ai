import { SignInButton } from '@/components/navbar/sign-in-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import '@/styles/globals.css';
import { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Sidebar from '../_components/Sidebar';
import Navbar from '../_components/Navbar';

async function ClientLayout({
    session,
    children
}: {
    children: React.ReactNode, session: Session | null,
}) {

     const workspaceCount = await prisma.workspace.count({
            where: {
              ownerId: session?.user.id,
            },
          });

    return (
        <div className="min-h-screen overflow-x-hidden">
            {!session && (
                <div className='flex items-center justify-center h-screen w-screen z-[5000]'>
                <Dialog open>
                    <DialogContent
                        className="sm:max-w-[500px] border-zinc-800 bg-zinc-900/90 backdrop-blur-sm"
                    >
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
            )}
            {/* {workspaceCount === 0 && typeof window !== 'undefined' && window.location.pathname === "/dashboard/workspaces/create" && (
                <div className='flex items-center justify-center h-screen w-screen z-[5000]'>
                <Dialog open>
                    <DialogContent
                        className="sm:max-w-[500px] border-zinc-800 bg-zinc-900/90 backdrop-blur-sm"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl text-zinc-100">No Workspaces</DialogTitle>
                            <p className="text-sm text-zinc-400">
                                You do not have any workspaces. Please create one to continue.
                            </p>
                        </DialogHeader>
                        <Button>
                           <Link href="/dashboard/workspaces/create">Create Workspace</Link>
                        </Button>
                    </DialogContent>
                </Dialog>
                </div>
            )} */}
            <div className="flex min-h-screen w-screen bg-background overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <main className="flex flex-1 flex-col gap-4 p-4 w-full md:gap-8 md:p-6">
              {children}
            </main>
          </div>
        </div>
        </div>
    );
};

export default ClientLayout;
