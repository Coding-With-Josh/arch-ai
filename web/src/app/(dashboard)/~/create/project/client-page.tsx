"use client";

import React, { useState } from 'react';
import { ChevronLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CreateProjectForm } from '../../../_components/create-project-form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema } from '../../../_components/create-project-form';
import { toast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { createProject } from '../../../_actions/create-project';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Session } from 'next-auth';

export const ClientPage = ({
    session,
    params
}: {
    session: Session | null,
    params: any
}) => {
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { workspaceSlug } = useParams()

    const form = useForm<z.infer<typeof projectFormSchema>>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
            description: "",
            projectType: "STANDARD",
            isHackathon: false,
            milestones: [],
        },
    });

    const onSubmit = async (data: z.infer<typeof projectFormSchema>) => {
        setIsSubmitting(true);
        try {
            // Prepare the complete project data
            const projectData = {
                name: data.name,
                slug: data.name.trim()
                .toLowerCase()
                .replace(/[\s\W-]+/g, "-"),
                description: data.description,
                workspaceSlug: workspaceSlug as string,
                projectType: data.projectType,
                startDate: data.startDate?.toISOString(),
                endDate: data.endDate?.toISOString(),
                ...(data.isHackathon && {
                    hackathonDetails: {
                        hackathonName: data.hackathonDetails?.hackathonName,
                        organizer: data.hackathonDetails?.organizer,
                        registrationDeadline: data.hackathonDetails?.registrationDeadline?.toISOString(),
                        submissionDeadline: data.hackathonDetails?.submissionDeadline?.toISOString(),
                        maxTeamSize: data.hackathonDetails?.maxTeamSize,
                        categories: data.hackathonDetails?.categories?.map(name => ({ name })),
                    },
                }),
                milestones: data.milestones?.map(milestone => ({
                    name: milestone.name,
                    description: milestone.description,
                    dueDate: milestone.dueDate.toISOString(),
                    isHackathonPhase: milestone.isHackathonPhase,
                    phaseType: milestone.phaseType,
                })),
            };

            // Call API to create project
            const newProject = await createProject(projectData);

            toast({
                title: "Success",
                description: "Project created successfully",
            });

            // Redirect to the new project
            router.push(`/${workspaceSlug}/${newProject.slug}`);
            setSuccess(true);
        } catch (error: any) {
            console.error("Project creation error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create project",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onNext = async () => {
        try {
            let isValid = true;

            // Validate current step before proceeding
            if (step === 1) {
                isValid = await form.trigger(["name", "description", "projectType"]);
            } else if (step === 2) {
                isValid = await form.trigger(["startDate", "endDate", "isHackathon"]);
            } else if (step === 3 && form.getValues("isHackathon")) {
                isValid = await form.trigger([
                    "hackathonDetails.hackathonName",
                    "hackathonDetails.registrationDeadline",
                    "hackathonDetails.submissionDeadline"
                ]);
            } else if (step === 4) {
                isValid = await form.trigger(["milestones"]);

                // Additional validation for milestones
                const milestones = form.getValues("milestones") || [];
                if (milestones.length === 0) {
                    toast({
                        title: "Milestones required",
                        description: "Please add at least one milestone",
                        variant: "destructive",
                    });
                    isValid = false;
                }
            }

            if (isValid) {
                setStep(step + 1);
            }
        } catch (error) {
            console.error("Validation error:", error);
        }
    };

    const onBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
            >
                <div className="h-screen w-screen flex flex-col overflow-hidden">
                    <nav className="w-full flex border-b border-b-muted/80 items-center justify-start py-3 px-5">
                        <div className="flex items-center justify-center gap-4">
                            <Link href={`/${workspaceSlug}`}>
                                <ChevronLeftCircle className="h-4 w-4 text-muted-foreground hover:scale-105 cursor-pointer" />
                            </Link>
                            <h1 className="text-xs text-zinc-800 dark:text-zinc-100">
                                Logged in as
                                <br />
                                <span className="font-bold">{session?.user?.email}</span>
                            </h1>
                        </div>
                    </nav>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center max-w-md p-6">
                            <h2 className="text-2xl font-bold mb-4">Project Created Successfully!</h2>
                            <p className="text-muted-foreground mb-6">
                                Your new project has been created and is ready to use.
                            </p>
                            <Button asChild>
                                <Link href={`/${workspaceSlug}`}>
                                    Return to Workspace
                                </Link>
                            </Button>
                        </div>
                    </div>
            </div>
        </motion.div>
    );
}

                return (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-4"
                >
                <div className="h-screen w-screen flex flex-col overflow-hidden">
                    <nav className="w-full flex border-b border-b-muted/80 items-center justify-start py-3 px-5">
                        <div className="flex items-center justify-center gap-4">
                            <Link href={`/${workspaceSlug}`}>
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
                        <div className="flex flex-col items-center justify-center gap-2 mb-8">
                            <h1 className="text-2xl text-zinc-800 font-semibold dark:text-zinc-100">
                                {step === 1 && "Create New Project"}
                                {step === 2 && "Set Project Timeline"}
                                {step === 3 && "Hackathon Details"}
                                {step === 4 && "Define Milestones"}
                                {step === 5 && "Review Project"}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {step === 1 && "Start by naming your project and selecting its type"}
                                {step === 2 && "Set your project's timeline and enable hackathon features if needed"}
                                {step === 3 && "Add details specific to your hackathon project"}
                                {step === 4 && "Define key milestones for tracking progress"}
                                {step === 5 && "Review all details before creating your project"}
                            </p>
                        </div>

                        <CreateProjectForm
                            step={step}
                            form={form}
                            onBack={onBack}
                            onNext={onNext}
                            onSubmit={onSubmit}
                        />

                        <div className="flex gap-4 mt-8">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                >
                                    Back
                                </Button>
                            )}
                            {step < 5 ? (
                                <Button
                                    type="button"
                                    className='w-72'
                                    onClick={onNext}
                                    disabled={isSubmitting}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    className='w-64'
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                >

                                    {isSubmitting ? "Creating..." : "Create Project"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };