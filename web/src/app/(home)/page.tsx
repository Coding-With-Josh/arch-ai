import React from 'react';
import Home from '../client-page';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'
import prisma from "@/lib/prisma"

const Page = async () => {
  const session = await auth();
  // let activeWorkspace;
  // if (session) {
  //   const userWithWorkspaces = await prisma.user.findUnique({
  //     where: { id: session.user.id },
  //     include: {
  //       workspaces: {
  //         orderBy: { updatedAt: 'desc' },
  //         take: 1,
  //       },
  //     },
  //   });
  //   activeWorkspace = userWithWorkspaces?.workspaces[0];
  // }

  // const activeWorkspace = "test"


    return (
        <Home session={session} />
    );
};

export default Page;