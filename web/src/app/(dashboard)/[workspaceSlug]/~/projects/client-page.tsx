"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical, FolderOpen, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    currentWorkspace,
    currentMembership
}: ClientPageProps) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-4">
                <div className='flex flex-col'>
                    <h1 className="text-lg font-semibold">Your projects</h1>
                    {currentWorkspace.ownerId === session?.user.id || (currentMembership.role === "OWNER" || currentMembership.role === "ADMIN") ?
                        (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage your projects in this workspace.</p>
                        ) : (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">You are a member of this workspace. View your workspace projects.</p>
                        )}
                    <Link href={`/${currentWorkspace.slug}`} className="mt-5">
                        <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-purple-700 rounded-full" />{currentWorkspace.name}</Badge>
                    </Link>
                </div>

                {currentWorkspace.projects.map((project: any) => (
                    <Link href={`/${currentWorkspace.slug}/projects/${project.id}`} key={project.id}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer relative rounded-2xl py-4 dark:hover:bg-zinc-900/30 border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 shadow-sm border hover:border-zinc-300 dark:hover:border-zinc-800">
                            <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-3">
                                    <CardTitle className="flex items-center gap-3.5">
                                        <Avatar className="size-8 rounded-md">
                                            <AvatarImage src={project.logo || ''} />
                                            <AvatarFallback className="text-sm font-semibold rounded-md">
                                                {project.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold">
                                            {project.name}
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-zinc-500 mt-2 dark:text-zinc-400">
                                        {project.description || 'No description'}
                                    </CardDescription>
                                </div>
                                {/* {getRoleBadge(project)} */}
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center">
                                        <FolderOpen className="mr-1 h-4 w-4" />
                                        <span>{project.studios.length} studios</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-1 h-4 w-4" />
                                        <span>{project.editors.length} editors</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))} 


                {currentWorkspace.projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-10">
                        <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No projects yet</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Create a new project to get started.</p>
                        <Link href={`/~/create/project`}>
                            <Button className="w-full max-w-xs mt-4">
                                Create a project
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Link href={`/~/create/project`}>
                        <Card className='border-dashed max-w-md flex items-center justify-center cursor-pointer hover:bg-zinc-300/70 dark:hover:bg-zinc-900/40 duration-300 dark:hover:border-zinc-500 transition-all py-8 rounded-xl'>
                            <CardContent className='flex flex-col items-center justify-center w-full gap-5'>
                                <Plus className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
                                <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Create a new project</h2>
                            </CardContent>
                        </Card>
                    </Link>
                )}



            </div>
        </motion.div>
    );
}

export default ClientPage;