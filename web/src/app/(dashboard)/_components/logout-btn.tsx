"use client";
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

const LogoutButton = () => {
    return (
        <Button onClick={() => signOut()}>
            <LogOut /> Logout
        </Button>
    );
};

export default LogoutButton;