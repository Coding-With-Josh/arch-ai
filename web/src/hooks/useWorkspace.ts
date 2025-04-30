// hooks/useWorkspace.ts
'use client';

import { useState, useCallback } from 'react';
import {
  createWorkspace,
  deleteWorkspace,
  inviteToWorkspace,
  acceptWorkspaceInvitation,
  getWorkspaceById,
} from '@/actions/workspace';
import {
  WorkspaceWithMembers,
  CreateWorkspaceInput,
  InviteToWorkspaceInput,
  UpdateWorkspaceInput,
  UpdateMemberRoleInput,
} from '@/types/workspace';
import { toast } from '@/components/ui/use-toast';

export const useWorkspace = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceWithMembers | null>(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    toast({
        title: 'Error',
        description: 'An error occurred while processing your request.',
        variant: 'destructive',
    });
    setError(message);
    setLoading(false);
    return message;
  };

  const createNewWorkspace = useCallback(async (input: CreateWorkspaceInput) => {
    setLoading(true);
    setError(null);
    try {
      const workspace = await createWorkspace(input);
      setLoading(false);
      return workspace;
    } catch (err) {
      return handleError(err);
    }
  }, []);

  const removeWorkspace = useCallback(async (workspaceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteWorkspace(workspaceId);
      setLoading(false);
      return result;
    } catch (err) {
      return handleError(err);
    }
  }, []); 

  const inviteMember = useCallback(async (input: InviteToWorkspaceInput) => {
    setLoading(true);
    setError(null);
    try {
      const invitation = await inviteToWorkspace(input);
      setLoading(false);
      return invitation;
    } catch (err) {
      return handleError(err);
    }
  }, []);

  const acceptInvitation = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await acceptWorkspaceInvitation(token);
      setLoading(false);
      return result;
    } catch (err) {
      return handleError(err);
    }
  }, []);

  const fetchWorkspace = useCallback(async (workspaceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const workspace = await getWorkspaceById(workspaceId);
      setCurrentWorkspace(workspace);
      setLoading(false);
      return workspace;
    } catch (err) {
      return handleError(err);
    }
  }, []);

  const clearWorkspace = useCallback(() => {
    setCurrentWorkspace(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    currentWorkspace,
    createWorkspace: createNewWorkspace,
    deleteWorkspace: removeWorkspace,
    inviteToWorkspace: inviteMember,
    acceptInvitation,
    getWorkspace: fetchWorkspace,
    clearWorkspace,
    clearError,
  };
};