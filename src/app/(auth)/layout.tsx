'use client'

import type { ReactNode } from 'react'
import { Container, Logo, SkipLink, ThemeToggle } from '@/components/layout'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="flex min-h-dvh flex-col bg-gradient">
            <SkipLink />
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm">
                    <Logo className="size-6" />
                    Dude, where&apos;s my cash?
                </div>
                <ThemeToggle />
            </header>
            <main
                id="main-content"
                tabIndex={-1}
                className="flex flex-1 items-center justify-center px-4 py-12"
            >
                <Container className="light">{children}</Container>
            </main>
            <footer className="py-4 text-center text-sm">
                <p>© {new Date().getFullYear()} DWMC. All rights reserved.</p>
            </footer>
        </div>
    )
}
