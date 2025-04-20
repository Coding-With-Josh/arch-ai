import { Navbar } from '@/components/landing/nav'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Toaster } from '@/components/ui/toaster'
import React, { ReactNode } from 'react'

interface WrapperProps {
    children: ReactNode
}

export const Wrapper = ({ children }: WrapperProps) => {
    return (
        <div>
            {children}
        </div>
    )
}
