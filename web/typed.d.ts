import { DefaultUser } from "next-auth";
import { DefaultUser } from "next-auth";
import { WebsiteRole, SubscriptionMethod } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | null;
      image?: string | null;
      websiteRole: WebsiteRole;
      isActive: boolean;
      hasCompletedOnboarding: boolean;
      subscription?: {
        subscriptionId: string;
        method: SubscriptionMethod;
      } | null;
    } & Partial<DefaultUser>;
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    websiteRole: WebsiteRole;
    isActive: boolean;
    hasCompletedOnboarding: boolean;
    subscription?: {
      subscriptionId: string;
      method: SubscriptionMethod;
    } | null;
  }
}
