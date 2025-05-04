"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Slash } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';

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
                <h1 className="text-lg font-semibold">Project analytics</h1>
                {currentWorkspace.ownerId === session?.user.id || (currentMembership.role === "OWNER" || currentMembership.role === "ADMIN") ?
                    (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Get an extensive analysis of your project.</p>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">You are a member of this project. Have an extensive analysis of the project.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                {/* Stats Card */}
                <>
                    <Card className="flex flex-col">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Editors</h2>
                        </CardHeader>
                        <div className="p-4">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Total Editors</span>
                                <span className="text-sm">5</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="flex flex-col">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Deployments</h2>
                        </CardHeader>
                        <div className="p-4">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Total Deployments</span>
                                <span className="text-sm">3</span>
                            </div>
                        </div>
                    </Card>
                </>

                {/* Timeline Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Timeline</h2>
                    </CardHeader>
                    <div className="p-4">
                        <ul className="relative border-l border-zinc-300 dark:border-zinc-700">
                            {[
                                {
                                    version: 'Version 1.0',
                                    date: '2023-01-01',
                                    description: 'Initial release with core features and basic UI components.'
                                },
                                {
                                    version: 'Version 1.1',
                                    date: '2023-02-15',
                                    description: 'Bug fixes, minor performance improvements, and usability enhancements.'
                                },
                                {
                                    version: 'Version 2.0',
                                    date: '2023-05-20',
                                    description: 'Major feature updates, complete UI overhaul, and improved accessibility.'
                                },
                                {
                                    version: 'Version 2.1',
                                    date: '2023-07-10',
                                    description: 'Additional performance tuning and stability improvements.'
                                },
                                {
                                    version: 'Version 3.0',
                                    date: '2023-09-05',
                                    description: 'Introduction of new modules, interactive features, and extended integrations.'
                                }
                            ].map((event, index) => (
                                <li key={index} className="mb-6 ml-6 relative">
                                    <span className="absolute flex items-center justify-center w-4 h-4 bg-purple-600 rounded-full -left-2 ring-8 ring-white dark:ring-gray-900 dark:bg-purple-400">
                                        <span className="absolute inline-flex w-4 h-4 bg-purple-600 rounded-full opacity-75 animate-ping"></span>
                                    </span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{event.version}</span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{event.date}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        {event.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>


        </div>
    );
}

export default ClientPage;