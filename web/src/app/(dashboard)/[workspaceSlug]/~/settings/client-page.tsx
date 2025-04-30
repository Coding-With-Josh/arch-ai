"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

type ClientPageProps = {
    params: {
        workspaceSlug: string;
    };
    currentWorkspace: any
    session: Session | null;
    currentMembership: any
    updateWorkspace: (formData: FormData) => Promise<any>;
    uploadLogo: (formData: FormData) => Promise<any>;
};

const ClientPage = ({
    params: { workspaceSlug },
    session,
    currentWorkspace,
    currentMembership,
    updateWorkspace,
    uploadLogo
}: ClientPageProps) => {
    const [values, setValues] = useState({
        workspaceName: currentWorkspace.name,
        workspaceSlug: currentWorkspace.slug,
        description: currentWorkspace.description || '',
        workspaceUrl: `https://arch-ai.dev.vercel.app/${workspaceSlug}`,
        logo: currentWorkspace.logo || '',
    });
    const [preview, setPreview] = useState<string>(currentWorkspace.logo || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const canEdit = currentWorkspace.ownerId === session?.user.id || 
                  ['OWNER', 'ADMIN'].includes(currentMembership.role);

    const handleInputChange = (field: keyof typeof values) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setValues(prev => ({ ...prev, [field]: e.target.value }));
        };

    const CopyButtonWithFeedback = ({ value }: { value: string }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            toast({
                title: "Copied to clipboard",
                description: "The workspace URL has been copied.",
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canEdit) return;

        const files = e.target.files;
        if (files && files.length > 0) {
            const selected = files[0];
            
            // Create preview
            if (selected.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(selected);
            } else {
                setPreview("");
                toast({
                    title: "Invalid file type",
                    description: "Please upload an image file",
                    variant: "destructive",
                });
                return;
            }
            
            // Upload file
            const formData = new FormData();
            formData.append('file', selected);
            
            try {
                setIsUploading(true);
                const result = await uploadLogo(formData);
                setValues(prev => ({ ...prev, logo: result.logo }));
                toast({
                    title: "Success",
                    description: "Logo updated successfully",
                });
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                setPreview(values.logo || ""); // Revert to previous logo
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;

        setIsSubmitting(true);
        
        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const result = await updateWorkspace(formData);
            
            toast({
                title: "Success",
                description: "Workspace updated successfully",
            });
            
            // Redirect if slug changed
            // if (result.slug !== workspaceSlug) {
            //     redirect(`/${result.slug}/settings`);
            // }
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
        >
            <div className='flex flex-col'>
                <h1 className="text-lg font-semibold">Workspace settings</h1>
                {canEdit ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage and edit your workspace details and billing.
                    </p>
                ) : (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        You are a member of this workspace. View your workspace settings but you can't edit them.
                    </p>
                )}
                <Link href={`/${currentWorkspace.slug}`} className="mt-5">
                    <Badge className="text-xs px-2 py-[3px] min-w-fit max-w-32 rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2">
                        <span className="size-[0.45rem] bg-purple-700 rounded-full" />
                        {currentWorkspace.name}
                    </Badge>
                </Link>
            </div>

            <div className='grid grid-cols-2 w-full gap-4 mt-10'>
                <Card className='px-6 pt-7 animate-in fade-in-50 slide-in-from-bottom-10'>
                    <CardTitle>Workspace details</CardTitle>
                    <CardDescription className='text-xs mt-1.5'>
                        {canEdit ? "Manage your workspace details." : "View your workspace details."}
                    </CardDescription>
                    <CardContent className='py-6 px-0'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-xs text-zinc-500 dark:text-zinc-400'>Workspace name</Label>
                                <Input
                                    name="workspaceName"
                                    type="text"
                                    value={values.workspaceName}
                                    onChange={handleInputChange('workspaceName')}
                                    className='text-xs text-zinc-500 dark:text-zinc-400 max-w-[24.5rem]'
                                    disabled={!canEdit || isSubmitting}
                                />
                            </div>
                            <div className="grid grid-cols-2 space-x-4">
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-xs text-zinc-500 dark:text-zinc-400'>Workspace slug</Label>
                                    <Input
                                        name="workspaceSlug"
                                        type="text"
                                        value={values.workspaceSlug}
                                        onChange={handleInputChange('workspaceSlug')}
                                        className='text-xs text-zinc-500 dark:text-zinc-400'
                                        disabled={!canEdit || isSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-xs text-zinc-500 dark:text-zinc-400'>Workspace url</Label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={`https://arch-ai-dev.vercel.app/${values.workspaceSlug}`}
                                            className='text-xs text-zinc-500/70 dark:text-zinc-400/70'
                                            readOnly
                                        />
                                        <CopyButtonWithFeedback value={`https://arch-ai-dev.vercel.app/${values.workspaceSlug}`} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-xs text-zinc-500 dark:text-zinc-400'>Workspace description</Label>
                                <Textarea
                                    name="description"
                                    value={values.description}
                                    onChange={handleInputChange('description')}
                                    className='text-xs text-zinc-500 dark:text-zinc-400'
                                    disabled={!canEdit || isSubmitting}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Workspace Logo
                                </Label>
                                <div className="border border-dashed border-zinc-300 dark:border-zinc-600 rounded-md p-4 flex flex-col items-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Workspace Logo Preview"
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
                                        className="text-xs" 
                                        accept="image/*"
                                        disabled={!canEdit || isUploading}
                                    />
                                </div>
                                {isUploading && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Uploading logo...
                                    </p>
                                )}
                            </div>
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
            </div>
        </motion.div>
    );
};

export default ClientPage;