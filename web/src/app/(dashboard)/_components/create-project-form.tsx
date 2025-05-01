"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, ChevronLeftCircle } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Project creation schema
export const projectFormSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    projectType: z.enum(["STANDARD", "HACKATHON"]),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isHackathon: z.boolean().default(false),
    hackathonDetails: z.object({
        hackathonName: z.string().optional(),
        organizer: z.string().optional(),
        registrationDeadline: z.date().optional(),
        submissionDeadline: z.date().optional(),
        maxTeamSize: z.number().min(1).optional(),
        categories: z.array(z.string()).optional(),
    }).optional(),
    milestones: z.array(z.object({
        name: z.string().min(1, "Milestone name is required"),
        description: z.string().optional(),
        dueDate: z.date(),
        isHackathonPhase: z.boolean().default(false),
        phaseType: z.string().optional(),
    })).optional(),
});

export function CreateProjectForm({
    step,
    form,
    onBack,
    onNext,
    onSubmit,
}: {
    step: number,
    form: any,
    onBack: () => void,
    onNext: () => void,
    onSubmit: (data: any) => void,
}) {
    const { watch, setValue } = form;
    const isHackathon = watch("isHackathon");
    const milestones = watch("milestones") || [];
    const hackathonCategories = watch("hackathonDetails.categories") || [];

    const addMilestone = () => {
        setValue("milestones", [
            ...milestones,
            {
                name: "",
                description: "",
                dueDate: new Date(),
                isHackathonPhase: false,
            },
        ]);
    };

    const removeMilestone = (index: number) => {
        const newMilestones = [...milestones];
        newMilestones.splice(index, 1);
        setValue("milestones", newMilestones);
    };

    const addHackathonCategory = () => {
        const newCategories = [...hackathonCategories, ""];
        setValue("hackathonDetails.categories", newCategories);
    };

    const removeHackathonCategory = (index: number) => {
        const newCategories = [...hackathonCategories];
        newCategories.splice(index, 1);
        setValue("hackathonDetails.categories", newCategories);
    };

    return (
        // <Card className="mt-6 sm:max-w-[500px] min-w-[42rem] border-transparent bg-transparent backdrop-blur-sm p-6">
        <div className="px-6 pb-6 sm:max-w-[500px] min-w-[42rem]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Basic Project Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My Awesome Project" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="What's this project about?"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="projectType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project type" className="text-sm" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="STANDARD" className="text-sm">Standard Project</SelectItem>
                                                <SelectItem value="HACKATHON" className="text-sm">Hackathon Project</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {/* Step 2: Project Timeline */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium"></h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm">Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm">End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => {
                                                            const startDate = form.getValues("startDate");
                                                            return date < (startDate || new Date());
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isHackathon"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Hackathon Project</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Enable hackathon-specific features
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked);
                                                    if (!checked) {
                                                        setValue("hackathonDetails", undefined);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {/* Step 3: Hackathon Details */}
                    {step === 3 && isHackathon && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Hackathon Details</h3>

                            <FormField
                                control={form.control}
                                name="hackathonDetails.hackathonName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hackathon Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Global Hackathon 2023" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hackathonDetails.organizer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organizer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tech Innovators Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="hackathonDetails.registrationDeadline"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Registration Deadline</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hackathonDetails.submissionDeadline"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Submission Deadline</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => {
                                                            const regDeadline = form.getValues("hackathonDetails.registrationDeadline");
                                                            return date < (regDeadline || new Date());
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="hackathonDetails.maxTeamSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Team Size</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="5"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Categories</FormLabel>
                                {hackathonCategories.map((category: string, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={category}
                                            onChange={(e) => {
                                                const newCategories = [...hackathonCategories];
                                                newCategories[index] = e.target.value;
                                                setValue("hackathonDetails.categories", newCategories);
                                            }}
                                            placeholder="Category name"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeHackathonCategory(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addHackathonCategory}
                                >
                                    Add Category
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Milestones */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Milestones</h3>
                                <Button type="button" onClick={addMilestone} variant="outline">
                                    Add Milestone
                                </Button>
                            </div>

                            {milestones.map((milestone: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Milestone {index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeMilestone(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`milestones.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Milestone name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`milestones.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Milestone description"
                                                        className="min-h-[60px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`milestones.${index}.dueDate`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {isHackathon && (
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name={`milestones.${index}.isHackathonPhase`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Hackathon Phase</FormLabel>
                                                            <p className="text-sm text-muted-foreground">
                                                                Mark as an official hackathon phase
                                                            </p>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {form.watch(`milestones.${index}.isHackathonPhase`) && (
                                                <FormField
                                                    control={form.control}
                                                    name={`milestones.${index}.phaseType`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phase Type</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select phase type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                                                                    <SelectItem value="REGISTRATION">Registration</SelectItem>
                                                                    <SelectItem value="KICKOFF">Kickoff</SelectItem>
                                                                    <SelectItem value="SUBMISSION">Submission</SelectItem>
                                                                    <SelectItem value="JUDGING">Judging</SelectItem>
                                                                    <SelectItem value="FINALS">Finals</SelectItem>
                                                                    <SelectItem value="WINNERS_ANNOUNCEMENT">Winners Announcement</SelectItem>
                                                                    <SelectItem value="POST_HACKATHON">Post-Hackathon</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {step === 5 && (
  <div className="space-y-6">
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary"
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(
                {
                  name: form.getValues("name"),
                  slug: form.getValues("slug"),
                  description: form.getValues("description") || "None",
                  projectType: form.getValues("projectType") === "HACKATHON" 
                    ? "Hackathon" 
                    : "Standard",
                  timeline: form.getValues("startDate")
                    ? `${format(form.getValues("startDate"), "PPP")} to ${format(
                        form.getValues("endDate"),
                        "PPP"
                      )}`
                    : "Not specified",
                  ...(isHackathon && {
                    hackathonDetails: {
                      hackathonName: form.getValues("hackathonDetails.hackathonName") || "None",
                      registrationDeadline: form.getValues("hackathonDetails.registrationDeadline")
                        ? format(
                            form.getValues("hackathonDetails.registrationDeadline"),
                            "PPP"
                          )
                        : "Not specified",
                      categories: hackathonCategories.length > 0 
                        ? hackathonCategories 
                        : "None",
                    },
                  }),
                  milestones: milestones.length > 0
                    ? milestones.map((m: any, i: number) => ({
                        milestone: i + 1,
                        name: m.name,
                        dueDate: format(m.dueDate, "PPP"),
                        ...(m.isHackathonPhase && { phaseType: m.phaseType }),
                      }))
                    : "None",
                },
                null,
                2
              )
            );
            toast({
              title: "Copied to clipboard",
              description: "Project configuration copied",
            });
          }}
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy Config
        </Button>
      </div>
      
      <div className="bg-[#1E1E1E] rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm font-mono">
          <code className="language-json">
            {JSON.stringify(
              {
                "✨ Project": {
                  name: form.getValues("name"),
                  slug: form.getValues("slug"),
                  description: form.getValues("description") || "None",
                  type: form.getValues("projectType") === "HACKATHON" 
                    ? "Hackathon" 
                    : "Standard",
                  timeline: form.getValues("startDate")
                    ? `${format(form.getValues("startDate"), "PPP")} → ${format(
                        form.getValues("endDate"),
                        "PPP"
                      )}`
                    : "Not specified",
                },
                ...(isHackathon && {
                  "🏆 Hackathon": {
                    name: form.getValues("hackathonDetails.hackathonName") || "None",
                    "📅 Registration": form.getValues(
                      "hackathonDetails.registrationDeadline"
                    )
                      ? format(
                          form.getValues("hackathonDetails.registrationDeadline"),
                          "PPP"
                        )
                      : "Not specified",
                    "🏷️ Categories": hackathonCategories.length > 0 
                      ? hackathonCategories 
                      : "None",
                  },
                }),
                "⏱️ Milestones": milestones.length > 0
                  ? milestones.map((m: any, i: number) => ({
                      "#": i + 1,
                      "📌 Name": m.name,
                      "📅 Due": format(m.dueDate, "PPP"),
                      ...(m.isHackathonPhase && { "🚩 Phase": m.phaseType }),
                    }))
                  : "None",
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </div>
    </div>
)}

                    {/* <div className="flex gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={onBack}>
                  Back
                </Button>
              )}
              {step < 5 ? (
                <Button type="button" onClick={onNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit">
                  Create Project
                </Button>
              )}
            </div> */}
                </form>
            </Form>
        </div>
        // {/* </Card> */}
    );
}
