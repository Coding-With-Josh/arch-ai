"use client"

import { Session } from 'next-auth';
import React, { useEffect } from 'react';

interface ClientPageProps {
    params: {
        workspaceSlug: string;
    };
    udpdateActiveWorkspace: () => void;
    session: Session | null;
    workspace: any; // Replace with the actual type of your workspace object
}


export default async function ClientPage({ params, udpdateActiveWorkspace, session, workspace }: ClientPageProps) {
    // useEffect(() => {
    //     udpdateActiveWorkspace()
    //   }, []);
    const { workspaceSlug } = await params;

    

    return (
        <div>
            <h1>Workspace: {workspaceSlug}</h1>
            <p>This is the workspace page for the slug: {workspaceSlug}</p>
        </div>
    );
}