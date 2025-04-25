import { z } from "zod";

export const workspaceFormSchema = z.object({
  step1: z.object({
    organizationName: z.string().min(3, "Name must be at least 3 characters"),
    organizationUrl: z.string().url("Invalid URL format"),
  }),
  step2: z.object({
    logo: z.instanceof(File).optional(),
  }),
  step3: z.object({
    subscribeNewsletter: z.boolean().default(false),
    followOnX: z.boolean().default(false),
    joinCommunity: z.boolean().default(false),
  }),
  step4: z.object({
    teamEmails: z.array(z.string().email("Invalid email format")).min(1, "Add at least one team member"),
  }),
});

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;