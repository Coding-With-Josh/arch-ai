import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GitHubProvider from 'next-auth/providers/github';

import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';
import { stripeServer } from '@/lib/stripe';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session;

      session.user.id = user.id;
      session.user.isActive = user.isActive;
      session.user.subscription = user.subscription
        ? {
            subscriptionId: user.subscription.subscriptionId,
            method: user.subscription.method,
          }
        : null;
      // Forward onboarding status if needed downstream.
      session.user.hasCompletedOnboarding = user.hasCompletedOnboarding;
      
      return session;
    },
    async redirect({ url, baseUrl, user }: any) {
      // // token.sub is populated with the user's id using the PrismaAdapter.
      // const userId = user?.id;
      // if (userId) {
      //   const currentUser = await prisma.user.findUnique({
      //     where: { id: userId },
      //   });
      //   // Redirect to /start if onboarding is not complete.
      //   if (currentUser && !currentUser.hasCompletedOnboarding) {
      //     return `${baseUrl}/start`;
      //   }
      // }
      return `${baseUrl}`;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (!user.email || !user.name) return;

      await stripeServer.customers
        .create({
          email: user.email,
          name: user.name,
        })
        .then(async (customer) => {
          await prisma.userSubscription.create({
            data: {
              user: { connect: { id: user.id } },
              subscriptionId: customer.id,
              method: 'STRIPE',
            },
          });
        });
    },
  },
});
