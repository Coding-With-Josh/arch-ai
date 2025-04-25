import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import '@/styles/globals.css';
import ClientLayout from './client-layout';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { RedirectNoWorkspace } from './redirect-no-workspace';

async function AppLayout({
	children
}: {
	children: React.ReactNode;
}) {

	// const hdrs = await headers();
	// const currentUrl = hdrs.get('x-nextjs-url') || '';
  
	const session = await auth();

	// if (currentUrl !== '/dashboard/workspaces/create') {
		RedirectNoWorkspace({ session });
	// }
      const workspaceCount = await prisma.workspace.count({
        where: {
          ownerId: session?.user.id,
        },
      });

	return (
		<ClientLayout session={session}>
			{children}
		</ClientLayout>
	);
};
    
export default AppLayout;
