import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import ClientPage from "./client-page";
import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { HackathonPhaseType } from "@prisma/client";

const Page = async ({ params }: { params: { workspaceSlug: string, projectSlug: string } }) => {
    const session = await auth();
    const { workspaceSlug, projectSlug } = params;
    
    // Fetch current workspace
    const currentWorkspace = await prisma.workspace.findFirst({
        where: { slug: workspaceSlug },
    });

    if (!currentWorkspace) {
        throw new Error("Workspace not found");
    }

    // Fetch current project with all related data
    const currentProject = await prisma.project.findFirst({
        where: {
            slug: projectSlug,
            workspaceId: currentWorkspace.id,
        },
        include: {
            workspace: true,
            hackathonDetails: true,
            milestones: true,
        }
    });

    if (!currentProject) {
        throw new Error("Project not found");
    }

    // Fetch current membership
    const currentMembership = await prisma.workspaceMembership.findFirst({
        where: {
            workspaceId: currentWorkspace.id,
            userId: session?.user.id,
        },
    });

    // Server action to update project
    const updateProject = async (formData: FormData) => {
        'use server';
        
        if (!session) throw new Error('Unauthorized');
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        const { projectName, description, projectSlug: newSlug, startDate, endDate } = Object.fromEntries(formData);

        const updatedProject = await prisma.project.update({
            where: { slug: projectSlug },
            data: {
                name: projectName as string,
                description: description as string,
                slug: newSlug as string,
                startDate: startDate ? new Date(startDate as string) : null,
                endDate: endDate ? new Date(endDate as string) : null,
            },
        });

        revalidatePath(`/${workspaceSlug}/${updatedProject.slug}/settings`);
        return updatedProject;
    };

    // Server action to upload logo
    // const uploadLogo = async (formData: FormData) => {
    //     'use server';
        
    //     if (!session) throw new Error('Unauthorized');
    //     if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
    //         throw new Error('Forbidden');
    //     }

    //     const file = formData.get('file') as File;
    //     const fileUrl = `/uploads/${file.name}`; // Replace with actual upload logic

    //     const updatedProject = await prisma.project.update({
    //         where: { slug: projectSlug },
    //         data: { logo: fileUrl },
    //     });

    //     revalidatePath(`/${workspaceSlug}/${projectSlug}/settings`);
    //     return updatedProject;
    // };

    // Server action to update hackathon details
    const updateHackathonDetails = async (formData: FormData) => {
        'use server';
        
        if (!session) throw new Error('Unauthorized');
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        const data = Object.fromEntries(formData);
        
        if (currentProject.hackathonDetails) {
            // Update existing hackathon details
            await prisma.hackathonDetails.update({
                where: { projectId: currentProject.id },
                data: {
                    hackathonName: data.hackathonName as string,
                    organizer: data.organizer as string,
                    website: data.website as string,
                    prizePool: data.prizePool as string,
                    rules: data.rules as string,
                    registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline as string) : null,
                    submissionDeadline: data.submissionDeadline ? new Date(data.submissionDeadline as string) : null,
                    judgingDate: data.judgingDate ? new Date(data.judgingDate as string) : null,
                    winnersAnnounced: data.winnersAnnounced ? new Date(data.winnersAnnounced as string) : null,
                    maxTeamSize: parseInt(data.maxTeamSize as string),
                    minTeamSize: parseInt(data.minTeamSize as string),
                },
            });
        } else {
            // Create new hackathon details
            await prisma.hackathonDetails.create({
                data: {
                    projectId: currentProject.id,
                    hackathonName: data.hackathonName as string,
                    organizer: data.organizer as string,
                    website: data.website as string,
                    prizePool: data.prizePool as string,
                    rules: data.rules as string,
                    registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline as string) : null,
                    submissionDeadline: data.submissionDeadline ? new Date(data.submissionDeadline as string) : null,
                    judgingDate: data.judgingDate ? new Date(data.judgingDate as string) : null,
                    winnersAnnounced: data.winnersAnnounced ? new Date(data.winnersAnnounced as string) : null,
                    maxTeamSize: parseInt(data.maxTeamSize as string),
                    minTeamSize: parseInt(data.minTeamSize as string),
                },
            });
        }

        revalidatePath(`/${workspaceSlug}/${projectSlug}/settings`);
    };

    // Server action to add milestone
    const addMilestone = async (formData: FormData) => {
        'use server';
        
        if (!session) throw new Error('Unauthorized');
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        const data = Object.fromEntries(formData);
        
        const newMilestone = await prisma.milestone.create({
            data: {
                projectId: currentProject.id,
                name: data.name as string,
                description: data.description as string,
                dueDate: new Date(data.dueDate as string),
                isHackathonPhase: data.isHackathonPhase === 'true',
                phaseType: data.isHackathonPhase === 'true' ? (data.phaseType as HackathonPhaseType) : null,
            },
        });

        revalidatePath(`/${workspaceSlug}/${projectSlug}/settings`);
        return newMilestone;
    };

    // Server action to delete milestone
    const deleteMilestone = async (id: string) => {
        'use server';
        
        if (!session) throw new Error('Unauthorized');
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
            throw new Error('Forbidden');
        }

        await prisma.milestone.delete({
            where: { id },
        });

        revalidatePath(`/${workspaceSlug}/${projectSlug}/settings`);
    };

    const updateMilestone = async (id: string, formData: FormData) => {
        'use server';
        
        if (!session) throw new Error('Unauthorized');
        if (!currentMembership || !['ADMIN', 'OWNER'].includes(currentMembership.role)) {
          throw new Error('Forbidden');
        }
      
        const data = Object.fromEntries(formData);
        
        const updatedMilestone = await prisma.milestone.update({
          where: { id },
          data: {
            name: data.name as string,
            description: data.description as string,
            dueDate: new Date(data.dueDate as string),
            isHackathonPhase: data.isHackathonPhase === 'true',
            phaseType: data.isHackathonPhase === 'true' ? (data.phaseType as HackathonPhaseType) : null,
          },
        });
      
        revalidatePath(`/${workspaceSlug}/${projectSlug}/settings`);
        return updatedMilestone;
      };

    return (
        <ClientPage 
            params={params} 
            currentProject={currentProject} 
            session={session} 
            currentMembership={currentMembership}
            updateProject={updateProject}
            updateHackathonDetails={updateHackathonDetails}
            updateMilestone={updateMilestone}
            addMilestone={addMilestone}
            deleteMilestone={deleteMilestone}
        />
    );
};

export default Page;