import React from 'react';
import prisma from '@/lib/prisma';
import ClientPage from './client-page';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options';


export default async function Page({ params }: { params: {workspaceSlug: string} }) {
    const { workspaceSlug } = await params;

    const session = await auth();

    const updateActiveWorkspace = async () => {
      if (session?.user) {
        await prisma.workspace.updateMany({
          where: {
            slug: workspaceSlug,
            OR: [
              { ownerId: session.user.id },
              {
                memberships: {
                  some: {
                    userId: session.user.id,
                    role: {
                      in: ['ADMIN', 'MEMBER', 'DEVELOPER', 'DESIGNER', 'GUEST']
                    }
                  }
                }
              }
            ]
          },
          data: { updatedAt: new Date() }
        });
      }
    }

    updateActiveWorkspace();

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: workspaceSlug,
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
                include: {
                    user: true,
                },
            },
            owner: true,
            invitations: {
                include: {
                    user: true,
                },
            },
        },

    });




    return (
       <ClientPage workspace={workspace} params={params} session={session} udpdateActiveWorkspace={updateActiveWorkspace} />
    );
}