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
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Parse the incoming URL relative to the base URL
      const { pathname } = new URL(url, baseUrl);

      // If coming from auth flow
      if (pathname === '/' || pathname === '/auth') {
        return `${baseUrl}/~/choose-workspace`;
      }

      // Otherwise, ensure the redirect URL stays on the same domain
      return url.startsWith(baseUrl) ? url : baseUrl;
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