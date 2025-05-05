// lib/api/projects.ts
import { Project, HackathonDetails, Milestone } from '@prisma/client';

export interface LaunchEditorPayload {
  name: string;
  slug: string;
  description?: string;
  projectId: string;
}


export async function launchEditor(data: LaunchEditorPayload) {
  try {
    const response = await fetch('/api/editor/launch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to launch editor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error launching editor:', error);
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
}