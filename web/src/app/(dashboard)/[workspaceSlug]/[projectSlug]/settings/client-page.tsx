"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Pencil, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HackathonPhaseType } from '@prisma/client';

type ClientPageProps = {
    params: {
        workspaceSlug: string;
        projectSlug: string;
    };
    currentProject: any;
    session: Session | null;
    currentMembership: any;
    updateProject: (formData: FormData) => Promise<any>;
    updateHackathonDetails: (formData: FormData) => Promise<any>;
    addMilestone: (formData: FormData) => Promise<any>;
    updateMilestone: (id: string, formData: FormData) => Promise<any>;
    deleteMilestone: (id: string) => Promise<any>;
};

const ClientPage = ({
    params: { workspaceSlug, projectSlug },
    session,
    currentProject,
    currentMembership,
    updateProject,
    updateHackathonDetails,
    addMilestone,
    updateMilestone,
    deleteMilestone
}: ClientPageProps) => {
    const [values, setValues] = useState({
        projectName: currentProject.name,
        projectSlug: currentProject.slug,
        description: currentProject.description || '',
        projectUrl: `https://arch-ai.dev.vercel.app/${workspaceSlug}/${projectSlug}`,
        logo: currentProject.logo || '',
        startDate: currentProject.startDate?.toISOString().split('T')[0] || '',
        endDate: currentProject.endDate?.toISOString().split('T')[0] || '',
        projectType: currentProject.projectType,
    });

    const [hackathonValues, setHackathonValues] = useState({
        hackathonName: currentProject.hackathonDetails?.hackathonName || '',
        organizer: currentProject.hackathonDetails?.organizer || '',
        website: currentProject.hackathonDetails?.website || '',
        prizePool: currentProject.hackathonDetails?.prizePool || '',
        rules: currentProject.hackathonDetails?.rules || '',
        registrationDeadline: currentProject.hackathonDetails?.registrationDeadline?.toISOString().split('T')[0] || '',
        submissionDeadline: currentProject.hackathonDetails?.submissionDeadline?.toISOString().split('T')[0] || '',
        judgingDate: currentProject.hackathonDetails?.judgingDate?.toISOString().split('T')[0] || '',
        winnersAnnounced: currentProject.hackathonDetails?.winnersAnnounced?.toISOString().split('T')[0] || '',
        maxTeamSize: currentProject.hackathonDetails?.maxTeamSize?.toString() || '5',
        minTeamSize: currentProject.hackathonDetails?.minTeamSize?.toString() || '1',
    });

    const [milestones, setMilestones] = useState(currentProject.milestones || []);
    const [newMilestone, setNewMilestone] = useState({
        name: '',
        description: '',
        dueDate: '',
        isHackathonPhase: false,
        phaseType: '',
    });

    const [preview, setPreview] = useState<string>(currentProject.logo || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<{
        id: string | null;
        name: string;
        description: string;
        dueDate: string;
        isHackathonPhase: boolean;
        phaseType: string;
    }>({
        id: null,
        name: '',
        description: '',
        dueDate: '',
        isHackathonPhase: false,
        phaseType: '',
    });

    const handleEditMilestone = (milestone: any) => {
        setEditingMilestone({
            id: milestone.id,
            name: milestone.name,
            description: milestone.description || '',
            dueDate: milestone.dueDate.toISOString().split('T')[0],
            isHackathonPhase: milestone.isHackathonPhase,
            phaseType: milestone.phaseType || '',
        });
    };

    const handleUpdateMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit || !editingMilestone.id) return;

        try {
            const formData = new FormData();
            formData.append('name', editingMilestone.name);
            formData.append('description', editingMilestone.description);
            formData.append('dueDate', editingMilestone.dueDate);
            formData.append('isHackathonPhase', String(editingMilestone.isHackathonPhase));
            formData.append('phaseType', editingMilestone.phaseType);

            const updatedMilestone = await updateMilestone(editingMilestone.id, formData);

            setMilestones((prev: any[]) => prev.map((m: { id: string | null; }) =>
                m.id === editingMilestone.id ? updatedMilestone : m
            ));
            setEditingMilestone({
                id: null,
                name: '',
                description: '',
                dueDate: '',
                isHackathonPhase: false,
                phaseType: '',
            });

            toast({
                title: "Success",
                description: "Milestone updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const canEdit = currentProject.workspace.ownerId === session?.user.id ||
        ['OWNER', 'ADMIN'].includes(currentMembership.role);

    const handleInputChange = (field: keyof typeof values) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setValues(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleHackathonChange = (field: keyof typeof hackathonValues) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setHackathonValues(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleMilestoneChange = (field: keyof typeof newMilestone, value: string | boolean) => {
        setNewMilestone(prev => ({ ...prev, [field]: value }));
    };

    const CopyButtonWithFeedback = ({ value }: { value: string }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            toast({
                title: "Copied to clipboard",
                description: "The project URL has been copied.",
                duration: 2000,
            });
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex items-center px-2 h-full py-2"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
        );
    };

    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!canEdit) return;

    //     const files = e.target.files;
    //     if (files && files.length > 0) {
    //         const selected = files[0];

    //         if (selected.type.startsWith("image/")) {
    //             const reader = new FileReader();
    //             reader.onloadend = () => setPreview(reader.result as string);
    //             reader.readAsDataURL(selected);
    //         } else {
    //             setPreview("");
    //             toast({
    //                 title: "Invalid file type",
    //                 description: "Please upload an image file",
    //                 variant: "destructive",
    //             });
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('file', selected);

    //         try {
    //             setIsUploading(true);
    //             const result = await uploadLogo(formData);
    //             setValues(prev => ({ ...prev, logo: result.logo }));
    //             toast({
    //                 title: "Success",
    //                 description: "Logo updated successfully",
    //             });
    //         } catch (error: any) {
    //             toast({
    //                 title: "Error",
    //                 description: error.message,
    //                 variant: "destructive",
    //             });
    //             setPreview(values.logo || "");
    //         } finally {
    //             setIsUploading(false);
    //         }
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const result = await updateProject(formData);

            toast({
                title: "Success",
                description: "Project updated successfully",
            });

            if (result.slug !== projectSlug) {
                redirect(`/${workspaceSlug}/${result.slug}/settings`);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleHackathonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            await updateHackathonDetails(formData);

            toast({
                title: "Success",
                description: "Hackathon details updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;

        try {
            const formData = new FormData();
            formData.append('name', newMilestone.name);
            formData.append('description', newMilestone.description);
            formData.append('dueDate', newMilestone.dueDate);
            formData.append('isHackathonPhase', String(newMilestone.isHackathonPhase));
            formData.append('phaseType', newMilestone.phaseType);

            const result = await addMilestone(formData);
            setMilestones((prev: any) => [...prev, result]);
            setNewMilestone({
                name: '',
                description: '',
                dueDate: '',
                isHackathonPhase: false,
                phaseType: '',
            });

            toast({
                title: "Success",
                description: "Milestone added successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDeleteMilestone = async (id: string) => {
        if (!canEdit) return;

        try {
            await deleteMilestone(id);
            setMilestones((prev: any[]) => prev.filter(m => m.id !== id));
            toast({
                title: "Success",
                description: "Milestone deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
        >
            <div className='flex flex-col'>
                <h1 className="text-lg font-semibold">Project settings</h1>
                {canEdit ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage and edit your project details.
                    </p>
                ) : (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        You are a member of this project. View your project settings but you can't edit them.
                    </p>
                )}
                <Link href={`/${workspaceSlug}/${projectSlug}`} className="mt-5">
                    <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2">
                        <span className="size-[0.45rem] bg-purple-700 rounded-full" />
                        {currentProject.name}
                    </Badge>
                </Link>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-4 mt-10'>
                {/* Project Details Card */}
                <Card className='animate-in fade-in-50 slide-in-from-bottom-10'>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>
                            {canEdit ? "Manage your project details" : "View project details"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <Label>Project name</Label>
                                <Input
                                    name="projectName"
                                    type="text"
                                    value={values.projectName}
                                    onChange={handleInputChange('projectName')}
                                    disabled={!canEdit || isSubmitting}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='flex flex-col gap-2'>
                                    <Label>Project slug</Label>
                                    <Input
                                        name="projectSlug"
                                        type="text"
                                        value={values.projectSlug}
                                        onChange={handleInputChange('projectSlug')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Project URL</Label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={`https://arch-ai-dev.vercel.app/${workspaceSlug}/${values.projectSlug}`}
                                            readOnly
                                        />
                                        <CopyButtonWithFeedback value={`https://arch-ai-dev.vercel.app/${workspaceSlug}/${values.projectSlug}`} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>Project description</Label>
                                <Textarea
                                    name="description"
                                    value={values.description}
                                    onChange={handleInputChange('description')}
                                    disabled={!canEdit || isSubmitting}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='flex flex-col gap-2'>
                                    <Label>Start Date</Label>
                                    <Input
                                        name="startDate"
                                        type="date"
                                        value={values.startDate}
                                        onChange={handleInputChange('startDate')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>End Date</Label>
                                    <Input
                                        name="endDate"
                                        type="date"
                                        value={values.endDate}
                                        onChange={handleInputChange('endDate')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <Label>Project Logo</Label>
                                <div className="border border-dashed border-zinc-300 dark:border-zinc-600 rounded-md p-4 flex flex-col items-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Project Logo Preview"
                                            className="max-h-36 object-contain mb-2 rounded"
                                        />
                                    ) : (
                                        <div className="h-36 flex items-center justify-center text-zinc-500">
                                            No logo uploaded
                                        </div>
                                    )}
                                    <Input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        accept="image/*"
                                        disabled={!canEdit || isUploading}
                                    />
                                </div>
                                {isUploading && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Uploading logo...
                                    </p>
                                )}
                            </div> */}
                            {canEdit && (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4"
                                >
                                    {isSubmitting ? "Saving..." : "Save changes"}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Hackathon Details Card (only shown if project is hackathon type) */}
                {values.projectType === 'HACKATHON' && (
                    <Card className='animate-in fade-in-50 slide-in-from-bottom-10'>
                        <CardHeader>
                            <CardTitle>Hackathon Details</CardTitle>
                            <CardDescription>
                                {canEdit ? "Configure hackathon settings" : "View hackathon details"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleHackathonSubmit} className='flex flex-col gap-5'>
                                <div className='flex flex-col gap-2'>
                                    <Label>Hackathon Name</Label>
                                    <Input
                                        name="hackathonName"
                                        value={hackathonValues.hackathonName}
                                        onChange={handleHackathonChange('hackathonName')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Organizer</Label>
                                    <Input
                                        name="organizer"
                                        value={hackathonValues.organizer}
                                        onChange={handleHackathonChange('organizer')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Website</Label>
                                    <Input
                                        name="website"
                                        value={hackathonValues.website}
                                        onChange={handleHackathonChange('website')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Prize Pool</Label>
                                    <Input
                                        name="prizePool"
                                        value={hackathonValues.prizePool}
                                        onChange={handleHackathonChange('prizePool')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Rules</Label>
                                    <Textarea
                                        name="rules"
                                        value={hackathonValues.rules}
                                        onChange={handleHackathonChange('rules')}
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <Label>Registration Deadline</Label>
                                        <Input
                                            name="registrationDeadline"
                                            type="date"
                                            value={hackathonValues.registrationDeadline}
                                            onChange={handleHackathonChange('registrationDeadline')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Submission Deadline</Label>
                                        <Input
                                            name="submissionDeadline"
                                            type="date"
                                            value={hackathonValues.submissionDeadline}
                                            onChange={handleHackathonChange('submissionDeadline')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <Label>Judging Date</Label>
                                        <Input
                                            name="judgingDate"
                                            type="date"
                                            value={hackathonValues.judgingDate}
                                            onChange={handleHackathonChange('judgingDate')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Winners Announced</Label>
                                        <Input
                                            name="winnersAnnounced"
                                            type="date"
                                            value={hackathonValues.winnersAnnounced}
                                            onChange={handleHackathonChange('winnersAnnounced')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <Label>Min Team Size</Label>
                                        <Input
                                            name="minTeamSize"
                                            type="number"
                                            value={hackathonValues.minTeamSize}
                                            onChange={handleHackathonChange('minTeamSize')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Max Team Size</Label>
                                        <Input
                                            name="maxTeamSize"
                                            type="number"
                                            value={hackathonValues.maxTeamSize}
                                            onChange={handleHackathonChange('maxTeamSize')}
                                            disabled={!canEdit || isSubmitting}
                                        />
                                    </div>
                                </div>
                                {canEdit && (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-4"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Hackathon Details"}
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Milestones Card */}
                <Card className='animate-in fade-in-50 slide-in-from-bottom-10 lg:col-span-2'>
                    <CardHeader>
                        <CardTitle>Project Milestones</CardTitle>
                        <CardDescription>
                            {canEdit ? "Manage your project milestones" : "View project milestones"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {milestones.map((milestone: any) => (
                                <div key={milestone.id} className="border rounded-lg p-4">
                                    {editingMilestone.id === milestone.id ? (
                                        <form onSubmit={handleUpdateMilestone} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className='flex flex-col gap-2'>
                                                    <Label>Milestone Name</Label>
                                                    <Input
                                                        value={editingMilestone.name}
                                                        onChange={(e) => setEditingMilestone(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    <Label>Due Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={editingMilestone.dueDate}
                                                        onChange={(e) => setEditingMilestone(prev => ({
                                                            ...prev,
                                                            dueDate: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={editingMilestone.description}
                                                    onChange={(e) => setEditingMilestone(prev => ({
                                                        ...prev,
                                                        description: e.target.value
                                                    }))}
                                                />
                                            </div>
                                            {values.projectType === 'HACKATHON' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="isHackathonPhase"
                                                            checked={editingMilestone.isHackathonPhase}
                                                            onChange={(e) => setEditingMilestone(prev => ({
                                                                ...prev,
                                                                isHackathonPhase: e.target.checked
                                                            }))}
                                                            className="h-4 w-4"
                                                        />
                                                        <Label htmlFor="isHackathonPhase">Hackathon Phase</Label>
                                                    </div>
                                                    {editingMilestone.isHackathonPhase && (
                                                        <div className='flex flex-col gap-2'>
                                                            <Label>Phase Type</Label>
                                                            <Select
                                                                value={editingMilestone.phaseType}
                                                                onValueChange={(value) => setEditingMilestone(prev => ({
                                                                    ...prev,
                                                                    phaseType: value
                                                                }))}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select phase type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.values(HackathonPhaseType).map(type => (
                                                                        <SelectItem key={type} value={type}>
                                                                            {type}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button type="submit">
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setEditingMilestone({
                                                        id: null,
                                                        name: '',
                                                        description: '',
                                                        dueDate: '',
                                                        isHackathonPhase: false,
                                                        phaseType: '',
                                                    })}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{milestone.name}</h3>
                                                <p className="text-sm text-zinc-500">{milestone.description}</p>
                                                <p className="text-xs text-zinc-400">
                                                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                                </p>
                                                {milestone.isHackathonPhase && (
                                                    <Badge className="mt-1">
                                                        {milestone.phaseType}
                                                    </Badge>
                                                )}
                                            </div>
                                            {canEdit && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditMilestone(milestone)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteMilestone(milestone.id)}
                                                    >
                                                        <Trash className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default ClientPage;