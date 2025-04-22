import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import '@/styles/globals.css';
import ClientLayout from './client-layout';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

async function AppLayout({
    children
}: {
    children: React.ReactNode;
}) {

    const session = await auth()
const workspaceCount = await prisma.workspace.count({
    where : {
        ownerId: session?.user.id
    }
})
if (workspaceCount === 0) {
    redirect('/dashboard/workspace/create');
}

    return (
        <ClientLayout session={session}>
            {children}
        </ClientLayout>
    );
};
    
export default AppLayout;
