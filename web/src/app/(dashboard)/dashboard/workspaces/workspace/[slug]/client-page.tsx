import React from 'react';
import ClientPage from './page';

interface WorkspacePageProps {
    params: {
        slug: string;
    };
}

export default function WorkspacePage({ params }: WorkspacePageProps) {

    return (
        <ClientPage params={params} />
    );
}