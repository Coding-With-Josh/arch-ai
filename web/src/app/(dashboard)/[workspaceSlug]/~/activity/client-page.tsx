"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type ClientPageProps = {
    params: {
        workspaceSlug: string;
    };
    currentWorkspace: any;
    session: Session | null;
    currentMembership: any
}

const ClientPage = ({
    params: { workspaceSlug },
    session,
    currentMembership,
    currentWorkspace
}: ClientPageProps) => {

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col'>
                <h1 className="text-lg font-semibold">Your activities</h1>
                {currentWorkspace.ownerId === session?.user.id || (currentMembership.role === "OWNER" || currentMembership.role === "ADMIN") ?
                    (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage your workspace activities. Track how well your workspace is operating.</p>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">You are a member of this workspace. View your workspace activities.</p>
                    )}
                <Link href={`/${currentWorkspace.slug}`} className="mt-5">
                    <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-purple-700 rounded-full" />{currentWorkspace.name}</Badge>
                </Link>
            </div>

        </div>
    );
}

export default ClientPage;