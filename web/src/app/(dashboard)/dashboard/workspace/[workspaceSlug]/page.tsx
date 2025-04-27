import React from 'react';
import prisma from '@/lib/prisma';


export default async function Page({ params }: { params: {workspaceSlug: string} }) {
    const { workspaceSlug } = await params;

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

    if (!workspace) {
        throw new Error(`Workspace not found for slug: ${workspaceSlug}`);
    }

    return (
        <div>
            <h1>Workspace: {workspace.name}</h1>
            <p>This is the workspace page for the slug: {workspaceSlug}</p>
        </div>
    );
}