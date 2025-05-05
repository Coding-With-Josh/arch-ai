"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MoreVertical, Plus, Slash } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Editor } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { LaunchEditorForm } from '@/app/(dashboard)/_components/launch-editor-form';
import { EditorDialog } from '@/app/(dashboard)/_components/launch-editor';

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
    currentProject,
}: ClientPageProps) => {

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col'>
                <h1 className="text-lg font-semibold">Editors</h1>
                {currentWorkspace.ownerId === session?.user.id || (currentMembership.role === "OWNER" || currentMembership.role === "ADMIN") ?
                    (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Get all the editors in your project.</p>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">You are a member of this project. Get all the editors in the project.</p>
                    )}
                <div className='flex items-center justify-center gap-3'>
                    <div className="flex items-center justify-center gap-2 mt-5">
                        <Link href={`/${currentWorkspace.slug}`} className="">
                            <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-purple-700 vgt rounded-full" />{currentWorkspace.name}</Badge>
                        </Link>
                        <Slash className="h-2.5 w-2.5 text-zinc-500 dark:text-zinc-600 rotate-12" />
                        <Link href={`/${currentWorkspace.slug}/${currentProject.slug}`} className="">
                            <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-yellow-600 rounded-full" />{currentProject.name}</Badge>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProject.editors.map((editor: Editor) => (
                    <Link href={`/${currentWorkspace.slug}/${currentProject.slug}/editors/${editor.slug}`}>
                        <div className='flex flex-col'>
                            <div className="h-64 w-32 bg-black"></div>
                            <div className="flex items-center justify-between text-sm">
                                <div className='flex flex-col gap-2'>
                                    <h2 className="text-sm font-semibold">{editor.name}</h2>
                                    <h2 className="text-sm font-semibold text-muted-foreground">
                                        {(() => {
                                            const diff = Date.now() - new Date(editor.updatedAt).getTime();
                                            const seconds = Math.floor(diff / 1000);
                                            const minutes = Math.floor(diff / (1000 * 60));
                                            const hours = Math.floor(diff / (1000 * 60 * 60));
                                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
                                            if (seconds < 60) {
                                                return `Viewed ${seconds} seconds ago`;
                                            } else if (minutes < 60) {
                                                return `Viewed ${minutes} minutes ago`;
                                            } else if (hours < 24) {
                                                return `Viewed ${hours} hours ago`;
                                            } else if (days < 7) {
                                                return `Viewed ${days} days ago`;
                                            } else {
                                                return `Viewed ${weeks} weeks ago`;
                                            }
                                        })()}
                                    </h2>
                                </div>
                                <Button variant={"ghost"}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {currentProject._count.editors === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-10">
                    <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No editors yet</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Launch an editor to get started.</p>
                    <EditorDialog projectId={currentProject.id} />
                </div>
            ) : (
                <EditorDialog projectId={currentProject.id} isEmptyState/>
            )}


        </div>
    );
}

export default ClientPage;