import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppProviders } from './providers'
import '@/styles/globals.css'

// Next.js requires route metadata to be exported from the layout module.
// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
    title: "Dude, Where's My Cash?",
    description: 'Personal budget management application',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}
