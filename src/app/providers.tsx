'use client'

import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/shared/theme'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="dwmc-theme">
            {children}
            <Toaster />
        </ThemeProvider>
    )
}
