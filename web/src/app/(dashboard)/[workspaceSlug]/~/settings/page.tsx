import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import ClientPage from "./client-page";
import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

const Page = async ({ params }: { params: { workspaceSlug: string } }) => {
    const session = await auth();
    const { workspaceSlug } = params;
    
    // Fetch current workspace data
    const currentWorkspace = await prisma.workspace.findFirst({
        where: {
            slug: workspaceSlug,
        },
        include: {
            _count: {
                select: {
                    projects: true,
                },
            },
            projects: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Fetch current membership
    const currentMembership = await prisma.workspaceMembership.findFirst({
        where: {
            workspaceId: currentWorkspace?.id,
            userId: session?.user.id,
        },
    });

    // Server action to handle form submission
    const updateWorkspace = async (formData: FormData) => {
        'use server';
        
        if (!session) {
            throw new Error('Unauthorized');
        }

        // Verify user has permission
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        const { workspaceName, description, workspaceSlug: newSlug } = Object.fromEntries(formData);

        // Update the workspace
        const updatedWorkspace = await prisma.workspace.update({
            where: {
                slug: workspaceSlug,
            },
            data: {
                name: workspaceName as string,
                description: description as string,
                slug: newSlug as string,
            },
        });

        revalidatePath(`/${updatedWorkspace.slug}/settings`);
        
        return updatedWorkspace;
    };

    // Server action to handle file upload
    const uploadLogo = async (formData: FormData) => {
        'use server';
        
        if (!session) {
            throw new Error('Unauthorized');
        }

        // Verify permissions
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        const file = formData.get('file') as File;
        
        // Implement your file upload logic here
        // For example:
        // const fileUrl = await uploadToStorage(file);
        const fileUrl = `/uploads/${file.name}`; // Replace with actual upload logic

        // Update workspace with new logo URL
        const updatedWorkspace = await prisma.workspace.update({
            where: {
                slug: workspaceSlug,
            },
            data: {
                logo: fileUrl,
            },
        });

        revalidatePath(`/${updatedWorkspace.slug}/settings`);
        
        return updatedWorkspace;
    };

    return (
        <ClientPage 
            params={params} 
            currentWorkspace={currentWorkspace} 
            session={session} 
            currentMembership={currentMembership}
            updateWorkspace={updateWorkspace}
            uploadLogo={uploadLogo}
        />
    );
};

export default Page;