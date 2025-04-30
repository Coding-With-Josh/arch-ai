// lib/api/projects.ts
import { Project, HackathonDetails, Milestone } from '@prisma/client';

export interface CreateProjectPayload {
  name: string;
  description?: string;
  workspaceSLug: string;
  projectType: 'STANDARD' | 'HACKATHON';
  startDate?: string;
  endDate?: string;
  hackathonDetails?: {
    hackathonName?: string;
    organizer?: string;
    registrationDeadline?: string;
    submissionDeadline?: string;
    maxTeamSize?: number;
    categories?: { name: string }[];
  };
  milestones?: {
    name: string;
    description?: string;
    dueDate: string;
    isHackathonPhase?: boolean;
    phaseType?: string;
  }[];
}

export interface ProjectWithDetails extends Project {
  hackathonDetails: HackathonDetails | null;
  milestones: Milestone[];
}

export async function createProject(data: CreateProjectPayload): Promise<ProjectWithDetails> {
  try {
    const response = await fetch('/api/projects/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
}