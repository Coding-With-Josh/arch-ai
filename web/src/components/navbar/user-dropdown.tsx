'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { env } from '@/env.mjs';
import * as m from '@/paraglide/messages';

export const UserDropdown = ({ session: { user } }: { session: Session }) => {
  const [isPending, setIsPending] = useState(false);

  const handleCreateCheckoutSession = async () => {
    setIsPending(true);
    const res = await fetch('/api/stripe/checkout-session');
    const checkoutSession = await res.json().then(({ session }) => session);
    const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name ? user.name.charAt(0) : '?'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{m.my_account()}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex flex-col items-center justify-center p-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name ? user.name.charAt(0) : '?'}</AvatarFallback>
            </Avatar>
            <h2 className="py-2 text-lg font-bold">{user?.name}</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={user?.isActive || isPending} className="w-64">
                  {user?.isActive ? (
                    m.you_are_a_pro()
                  ) : (
                    <>
                      {isPending && (
                        <Icons.loader className="mr-2 size-4 animate-spin" />
                      )}
                      {m.upgrade_to_pro_cta()}
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-zinc-900/70 backdrop-blur-md'>
                <DialogHeader>
                  <DialogTitle>Choose Payment Method</DialogTitle>
                </DialogHeader>
                <div className="flex justify-around py-4">
                  <Button
                    onClick={() => {
                      // Close dialog then call checkout (Dialog closes automatically).
                      handleCreateCheckoutSession();
                    }}
                  >
                    Stripe
                  </Button>
                  <Button
                    onClick={() => {
                      // Web3 functionality goes here (currently blank)
                    }}
                  >
                    Web3
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="destructive">Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <Icons.logOut className="mr-2 size-4" /> <span>{m.log_out()}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
