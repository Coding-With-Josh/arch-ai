// app/actions/workspace.ts
'use server';

import prisma from '@/lib/prisma';
import { WorkspaceRole, InvitationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { CreateWorkspaceInput, InviteToWorkspaceInput, WorkspaceWithMembers } from '@/types/workspace';

export const createWorkspace = async (input: CreateWorkspaceInput) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const slug = input.name.toLowerCase().replace(/\s+/g, '-');
    
    const workspace = await prisma.workspace.create({
      data: {
        name: input.name,
        description: input.description,
        slug,
        logo: input.logo,
        ownerId: session.user.id,
        memberships: {
          create: {
            userId: session.user.id,
            role: WorkspaceRole.ADMIN,
            status: 'ACTIVE',
          },
        },
      },
    });

    revalidatePath(`${workspace.slug}`);
    return workspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw new Error('Failed to create workspace');
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    // Verify user is the owner
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.ownerId !== session.user.id) {
      throw new Error('Unauthorized');
    }

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting workspace:', error);
    throw new Error('Failed to delete workspace');
  }
};

export const inviteToWorkspace = async (input: InviteToWorkspaceInput) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    // Verify user has permission to invite (admin or owner)
    const membership = await prisma.workspaceMembership.findFirst({
      where: {
        workspaceId: input.workspaceId,
        userId: session.user.id,
        role: { in: [WorkspaceRole.ADMIN] },
      },
    });

    if (!membership) {
      throw new Error('Unauthorized');
    }

    // Check if user already has an invitation or is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      const existingMembership = await prisma.workspaceMembership.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: existingUser.id,
        },
      });

      if (existingMembership) {
        throw new Error('User is already a member of this workspace');
      }
    }

    const existingInvitation = await prisma.workspaceInvitation.findFirst({
      where: {
        workspaceId: input.workspaceId,
        email: input.email,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      throw new Error('User already has a pending invitation');
    }

    // Create invitation
    const token = crypto.randomUUID();
    const invitation = await prisma.workspaceInvitation.create({
      data: {
        workspaceId: input.workspaceId,
        email: input.email,
        role: input.role,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userId: existingUser?.id,
      },
    });

    // TODO: Send email invitation here

    revalidatePath(`/workspace/${input.workspaceId}/members`);
    return invitation;
  } catch (error) {
    console.error('Error inviting to workspace:', error);
    throw error instanceof Error ? error : new Error('Failed to send invitation');
  }
};

export const acceptWorkspaceInvitation = async (token: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { token },
    });

    if (!invitation || invitation.email !== session.user.email) {
      throw new Error('Invalid invitation');
    }

    if (invitation.expiresAt < new Date()) {
      throw new Error('Invitation has expired');
    }

    if (invitation.status !== 'PENDING') {
      throw new Error('Invitation has already been processed');
    }

    // Create membership
    await prisma.$transaction([
      prisma.workspaceMembership.create({
        data: {
          workspaceId: invitation.workspaceId,
          userId: session.user.id,
          role: invitation.role,
          status: 'ACTIVE',
        },
      }),
      prisma.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw new Error('Failed to accept invitation');
  }
};

export const saveWalletToUser = async (wallet: any) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  // Destructure wallet properties safely
  const { walletAddress, balance } = JSON.parse(JSON.stringify(wallet));

  try {
      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          web3Wallets: {
            upsert: {
              where: {
                address: walletAddress
              },
              create: {
                address: walletAddress,
                type: "SOLANA",
                status: "ACTIVE",
                balance: balance
              },
              update: {
                address: walletAddress,
                type: "SOLANA",
                status: "ACTIVE",
                balance: balance
              }
            }
          }
        }
      })

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error saving wallet:', error);
    throw new Error('Failed to save wallet');
  }
};

export const getWorkspaceById = async (workspaceId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    // Verify user has access to this workspace
    const membership = await prisma.workspaceMembership.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      throw new Error('Unauthorized');
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        invitations: true,
      },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Transform data with proper null handling
    const transformedWorkspace: WorkspaceWithMembers = {
      ...workspace,
      description: workspace.description ?? null,
      logo: workspace.logo ?? null,
      members: workspace.memberships.map((m) => ({
        id: m.id,
        userId: m.user.id,
        name: m.user.name ?? '',
        email: m.user.email ?? "",
        image: m.user.image ?? "",
        role: m.role,
      })),
      invitations: workspace.invitations.map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        status: i.status,
        createdAt: i.createdAt,
        expiresAt: i.expiresAt,
        userId: i.userId,
      })),
    };

    return transformedWorkspace;
  } catch (error) {
    console.error('Error fetching workspace:', error);
    throw new Error('Failed to fetch workspace');
  }
};