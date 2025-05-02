import React from 'react';
import prisma from '@/lib/prisma';
import ClientPage from './client-page';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { redirect } from 'next/navigation';


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

    return (
    redirect(`/${workspaceSlug}/~/overview`)
    );
}