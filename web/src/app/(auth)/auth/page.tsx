'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { SignInButton } from '@/components/navbar/sign-in-button';

export default function SignInPage() {

    return (
        <div className="grid w-full min-h-screen grow items-center bg-zinc-950 px-4 sm:justify-center">
            <Card className="w-full border-zinc-800 bg-zinc-900/50 backdrop-blur sm:w-96">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Sign into your account with your GitHub.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-y-6">

                        <SignInButton />

                </CardContent>
                <CardFooter>
                    <div className="grid w-full gap-y-4">
                        <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <Link href="/help/authentication">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Having trouble authenticating?
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}