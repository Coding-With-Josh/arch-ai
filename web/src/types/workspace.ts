import { InvitationStatus, WorkspaceRole } from "@prisma/client";

// types/workspace.ts
export type Workspace = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    logo: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type WorkspaceMember = {
    id: string;
    userId: string;
    name: string;
    email: string;
    image?: string;
    role: WorkspaceRole;
  };
  
  export type WorkspaceInvitation = {
    id: string;
    email: string;
    role: WorkspaceRole;
    status: InvitationStatus;
    createdAt: Date;
  };
  
  export type WorkspaceWithMembers = Workspace & {
    members: WorkspaceMember[];
    invitations: WorkspaceInvitation[];
  };
  
  export type CreateWorkspaceInput = {
    name: string;
    description?: string;
    logo?: string;
  };
  
  export type InviteToWorkspaceInput = {
    workspaceId: string;
    email: string;
    role: WorkspaceRole;
  };
  
  export type UpdateWorkspaceInput = {
    name?: string;
    description?: string;
    logo?: string;
  };
  
  export type UpdateMemberRoleInput = {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  };