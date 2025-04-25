"use client"

import React, { useState } from 'react';
import { ChevronLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CreateWorkspaceForm } from '@/app/(dashboard)/_components/create-workspace-form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useWorkspace } from '@/hooks/useWorkspace';
import { toast } from '@/components/ui/use-toast';

export const ClientPage = ({ session }: { session: { user?: { email: string } } | null }) => {
  const [step, setStep] = useState(1);
  const [teamEmails, setTeamEmails] = useState(["", ""]);
  const { createWorkspace, loading } = useWorkspace();

  const form = useForm({
    defaultValues: {
      workspaceName: "",
      description: "",
      logo: "",
      workspaceUrl: "https://arch-ai.dev.vercel.app/",
      subscribeNewsletter: false,
      followOnX: false,
      joinCommunity: false,
      teamEmails: ["", ""],
    },
  });

  const { watch, setValue, handleSubmit } = form;
  const workspaceName = watch("workspaceName");

  React.useEffect(() => {
    const slug = workspaceName
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, "-");
    setValue("workspaceUrl", `https://arch-ai.dev.vercel.app/${slug}`);
  }, [workspaceName, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await createWorkspace({
        name: data.workspaceName,
        description: data.description,
        logo: data.logo,
      });
      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTeamEmail = (index: number, value: string) => {
    const newEmails = [...teamEmails];
    newEmails[index] = value;
    setTeamEmails(newEmails);
    setValue("teamEmails", newEmails);
  };

  const onNext = async () => {
    try {
      if (step === 1) {
        const isValid = await form.trigger(["workspaceName", "workspaceUrl"]);
        if (isValid) setStep(step + 1);
      } else if (step === 4) {
        const hasEmails = teamEmails.some(email => email.trim() !== "");
        if (hasEmails) {
          const isValid = await form.trigger("teamEmails");
          if (isValid) setStep(step + 1);
        } else {
          setStep(step + 1);
        }
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      console.error("Error in onNext:", error);
    }
  };

  const onBack = () => setStep(step - 1);

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="w-full flex border-b border-b-muted/80 items-center justify-start py-3 px-5">
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard/workspaces">
            <ChevronLeftCircle className="h-4 w-4 text-muted-foreground hover:scale-105 cursor-pointer" />
          </Link>
          <h1 className="text-xs text-zinc-800 dark:text-zinc-100">
            Logged in as
            <br />
            <span className="font-bold">{session?.user?.email}</span>
          </h1>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-18">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl text-zinc-800 font-semibold dark:text-zinc-100">
            {step === 1 && "Create a new workspace"}
            {step === 2 && "Workspace details"}
            {step === 3 && "Choose your style"}
            {step === 4 && "Invite your team"}
            {step === 5 && "Subscribe to updates"}
            {step === 6 && "Review your workspace"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {step === 1 && "Embrace the challenge. Every big journey begins with a single bold step! Create a workspace."}
            {step === 2 && "Add some details about your workspace to make it unique"}
            {step === 3 && "Choose your preferred style for your workspace."}
            {step === 4 && "Collaborate with your team members."}
            {step === 5 && "Stay updated with our latest features and news"}
            {step === 6 && "Review your workspace details before creation"}
          </p>
        </div>
        
        <CreateWorkspaceForm 
          step={step} 
          form={form} 
          onBack={onBack} 
          onNext={onNext} 
          onSubmit={handleSubmit(onSubmit)} 
          teamEmails={teamEmails} 
          updateTeamEmail={updateTeamEmail} 
        />

        <div className="flex gap-4 mt-8">
          {step < 6 ? (
            <Button type="button" onClick={onNext} className="w-64">
              {step === 1 && "Continue"}
              {step === 2 && "Continue"}
              {step === 3 && "Choose style"}
              {step === 4 && "Invite or skip"}
              {step === 5 && "Subscribe"}
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};