// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '../../auth/[...nextauth]/auth-options';

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate the workspace belongs to the user
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: body.workspaceSlug,
        OR: [
          { ownerId: user.id },
          {
            memberships: {
              some: {
                userId: user.id,
                role: 'ADMIN',
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        workspace: { connect: { id: workspace.id } },
        projectType: body.projectType,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        ...(body.projectType === 'HACKATHON' && body.hackathonDetails && {
          hackathonDetails: {
            create: {
              hackathonName: body.hackathonDetails.hackathonName,
              organizer: body.hackathonDetails.organizer,
              registrationDeadline: body.hackathonDetails.registrationDeadline 
                ? new Date(body.hackathonDetails.registrationDeadline) 
                : undefined,
              submissionDeadline: body.hackathonDetails.submissionDeadline 
                ? new Date(body.hackathonDetails.submissionDeadline) 
                : undefined,
              maxTeamSize: body.hackathonDetails.maxTeamSize,
              ...(body.hackathonDetails.categories && {
                categories: {
                  createMany: {
                    data: body.hackathonDetails.categories.map((cat: { name: string }) => ({
                      name: cat.name,
                    })),
                  },
                },
              }),
            },
          },
        }),
        ...(body.milestones && {
          milestones: {
            createMany: {
              data: body.milestones.map((milestone: any) => ({
                name: milestone.name,
                description: milestone.description,
                dueDate: new Date(milestone.dueDate),
                isHackathonPhase: milestone.isHackathonPhase || false,
                phaseType: milestone.phaseType || null,
              })),
            },
          },
        }),
      },
      include: {
        hackathonDetails: {
          include: {
            categories: true,
          },
        },
        milestones: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}