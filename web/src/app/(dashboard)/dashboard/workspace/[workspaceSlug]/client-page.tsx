import React from 'react';

interface ClientPageProps {
    params: {
        slug: string;
    };
}

export default async function ClientPage({ params }: ClientPageProps) {
    const { slug } = await params;

    

    return (
        <div>
            <h1>Workspace: {slug}</h1>
            <p>This is the workspace page for the slug: {slug}</p>
        </div>
    );
}