import ClientPage from './client-page'
import prisma from '@/lib/prisma'
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Choose Workspace',
  description: 'Choose a workspace to manage your projects and team',
}

const Page = async () => {
  const session = await auth()
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
  
  const lastWorkspace = await prisma.workspace.findFirst({
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
      orderBy: { updatedAt: 'desc' }
    });
    
    if (lastWorkspace) {
      redirect(`/${lastWorkspace.slug}`);
    }

  return <ClientPage workspaces={workspaces} currentUserId={session?.user.id} />
}

export default Page