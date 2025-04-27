"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Copy, Moon, Sun, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import Link from "next/link";

export const formSchema = z.object({
  workspaceName: z.string().min(1, "Workspace name is required"),
  workspaceUrl: z.string().url("Invalid URL format"),
  description: z.string().optional(),
  logo: z.union([z.string().url(), z.string().startsWith('data:image')]).optional(),
  subscribeNewsletter: z.boolean().default(false),
  followOnX: z.boolean().default(false),
  joinCommunity: z.boolean().default(false),
  teamEmails: z.array(z.string().email("Invalid email format")).optional(),
});

export function CreateWorkspaceForm({
  step,
  form,
  onBack,
  onNext,
  onSubmit,
  teamEmails,
  updateTeamEmail
}: {
  step: number,
  form: any,
  onBack: () => void,
  onNext: () => void,
  onSubmit: (data: any) => void,
  teamEmails: string[],
  updateTeamEmail: (index: number, value: string) => void
}) {
  const { theme, setTheme } = useTheme();

  function CopyButtonWithFeedback({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The workspace URL has been copied.",
        duration: 2000,
      });
    };

    useEffect(() => {
      if (copied) {
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [copied]);

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
  }

  return (
    <Card className="mt-9 sm:max-w-[500px] min-w-[42rem] border-transparent bg-transparent backdrop-blur-sm p-6">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Step 1: Workspace Details */}
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} className="bg-white dark:bg-zinc-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workspaceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="bg-white dark:bg-zinc-900 text-muted-foreground pr-10"
                            readOnly
                          />
                          <CopyButtonWithFeedback value={field.value} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Workspace Details */}
            {step === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] bg-white dark:bg-zinc-900"
                          placeholder="What's this workspace about?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  field.onChange(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="bg-white dark:bg-zinc-900"
                          />
                          {field.value && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border">
                              <img
                                src={field.value}
                                alt="Workspace logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">


                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-24 flex-col gap-2 justify-center items-center border border-zinc-300 dark:border-zinc-700"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-lg font-semibold">Light Mode</span>
                    <span className="text-sm text-zinc-500">Bright & Clear</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-24 flex-col gap-2 justify-center items-center border border-zinc-300 dark:border-zinc-700"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-lg font-semibold">Dark Mode</span>
                    <span className="text-sm text-zinc-500">Elegant & Focused</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Subscription Options */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className=""></div>

                  <FormField
                    control={form.control}
                    name="subscribeNewsletter"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex items-center space-x-3 justify-between">
                          <div>
                            <FormLabel>Subscribe to our monthly newsletter</FormLabel>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Receive monthly updates by user email inbox.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="border-t border-zinc-200 dark:border-zinc-900"></div>

                  <FormField
                    control={form.control}
                    name="followOnX"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex items-center space-x-3 justify-between">
                          <div>
                            <FormLabel>Follow us on X</FormLabel>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Register posts with updates and tips.
                            </p>
                          </div>
                          <Button variant={"secondary"}>
                            <Link href="https://x.com/build_with_arch" target="_blank" rel="noopener noreferrer">
                              @build_with_arch
                            </Link>
                          </Button>

                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="border-t border-zinc-200 dark:border-zinc-900"></div>

                  <FormField
                    control={form.control}
                    name="joinCommunity"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex items-center space-x-3 justify-between">
                          <div>
                            <FormLabel>Join our Discord community</FormLabel>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Chat with other developers and founders.
                            </p>
                          </div>
                          <Button variant={"secondary"}>
                            <Link href="https://discord.gg/build_with_arch" target="_blank" rel="noopener noreferrer">
                              Join Discord
                            </Link>
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="border-t border-zinc-200 dark:border-zinc-900"></div>
                </div>
              </div>
            )}

            {/* Step 4: Team Invites */}
            {step === 5 && (
              <div className="space-y-6">
                <div className=""></div>

                <div className="space-y-4">
                  <FormLabel>Email addresses</FormLabel>
                  {teamEmails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={email}
                        onChange={(e) => updateTeamEmail(index, e.target.value)}
                        className="bg-white dark:bg-zinc-900 flex-1"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newEmails = [...teamEmails];
                            newEmails.splice(index, 1);
                            form.setValue("teamEmails", newEmails);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateTeamEmail(teamEmails.length, "")}
                  >
                    Add Team Member
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Workspace Name: </span>
                    {form.getValues("workspaceName")}
                  </div>
                  <div>
                    <span className="font-semibold">Workspace URL: </span>
                    {form.getValues("workspaceUrl")}
                  </div>
                  <div>
                    <span className="font-semibold">Subscriptions: </span>
                    {[
                      form.getValues("subscribeNewsletter") && "Newsletter",
                      form.getValues("followOnX") && "X (Twitter)",
                      form.getValues("joinCommunity") && "Community",
                    ].filter(Boolean).join(", ") || "None"}
                  </div>
                  <div>
                    {teamEmails.filter(e => e).length > 0 ? (
                      <>
                        <span className="font-semibold">Team Members: </span>
                        {teamEmails.filter(e => e).join(", ")}
                      </>
                    ) : (
                      <span className="font-semibold">Team Members: <span className="font-normal">None</span></span>
                    )}
                    {teamEmails.filter(e => e).join(", ")}
                  </div>
                </div>
              </div>
            )}

          </form>
        </Form>
      </div>
    </Card>
  );
}