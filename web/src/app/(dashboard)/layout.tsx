import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import '@/styles/globals.css';
import ClientLayout from './client-layout';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

async function AppLayout({
	children
}: {
	children: React.ReactNode;
}) {

  
	const session = await auth();
	const workspaces = await prisma.workspace.findMany({
		where: {
		  OR: [
			{ ownerId: session?.user.id },
			{
			  memberships: {
				some: {
				  userId: session?.user.id,
				  role: { in: ['ADMIN', 'MEMBER', 'DEVELOPER', 'DESIGNER', 'GUEST'] }
				}
			  }
			}
		  ]
		},
		include: {
		  _count: {
			select: {
			  projects: true,
			  memberships: true,
			  invitations: true,
			},
		  },
		  projects: true,
		  memberships: {
			where: {
			  userId: session?.user.id
			},
			include: {
			  user: true,
			},
		  },
		  owner: true,
		  invitations: {
			where: {
			  OR: [
				{ email: session?.user.email || '' },
				{ userId: session?.user.id }
			  ],
			  status: 'PENDING'
			},
			include: {
			  user: true,
			},
		  },
		},
		orderBy: {
		  createdAt: 'desc'
		}
	  })


	return (
		<ClientLayout session={session} workspaces={workspaces}>
			{children}
		</ClientLayout>
	);
};
    
export default AppLayout;
