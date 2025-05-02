import React from 'react';
import Home from '../client-page';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'
import prisma from "@/lib/prisma"

const Page = async () => {
    const session = await auth()
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
        <Home session={session} activeWorkspace={activeWorkspace} />
    );
};

export default Page;