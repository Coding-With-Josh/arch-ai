"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Slash } from 'lucide-react';

type ClientPageProps = {
    params: {
        workspaceSlug: string;
    };
    currentWorkspace: any;
    session: Session | null;
    currentMembership: any;
    currentProject: any;
}

const ClientPage = ({
    session,
    currentWorkspace,
    currentMembership,
    currentProject
}: ClientPageProps) => {

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col'>
                <h1 className="text-lg font-semibold">Project overview</h1>
                {currentWorkspace.ownerId === session?.user.id || (currentMembership.role === "OWNER" || currentMembership.role === "ADMIN") ?
                    (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Get an overview of your project.</p>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">You are a member of this project. Have an overview of the project.</p>
                    )}
                    <div className='flex items-center justify-center gap-3'>
                <Link href={`/${currentWorkspace.slug}`} className="mt-5">
                    <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-purple-700 vgt rounded-full" />{currentWorkspace.name}</Badge>
                </Link>
                <Slash className="h-2.5 w-2.5 text-zinc-500 dark:text-zinc-600 rotate-12" />
                <Link href={`/${currentProject.slug}`} className="mt-5">
                    <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-yellow-600 rounded-full" />{currentProject.name}</Badge>
                </Link>
                </div>
            </div>

        </div>
    );
}

export default ClientPage;