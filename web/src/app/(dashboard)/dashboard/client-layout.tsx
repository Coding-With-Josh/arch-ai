import { SignInButton } from '@/components/navbar/sign-in-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import '@/styles/globals.css';
import { Session } from 'next-auth';

function ClientLayout({
    session,
    children
}: {
    children: React.ReactNode, session: Session | null,
}) {
    return (
        <div className="min-h-screen overflow-x-hidden">
            {!session ? (
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
            ) : (
                session?.user.organizations
            )}
            {children}
        </div>
    );
};

export default ClientLayout;
