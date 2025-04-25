import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';

// Removed the URL check since it's now handled in layout.tsx
export async function RedirectNoWorkspace({ session }: { session: Session | null }) {
  if (!session) return;
    
  const workspaceCount = await prisma.workspace.count({
    where: {
      ownerId: session.user.id,
    },
  });
    
  if (workspaceCount === 0 && typeof window !== 'undefined' && window.location.pathname === "/dashboard/workspaces/create") {
    redirect('/dashboard/workspaces/create');
  }
}