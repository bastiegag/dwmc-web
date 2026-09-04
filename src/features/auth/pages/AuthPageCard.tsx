import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

interface AuthPageCardProps {
    headingId: string
    heading: string
    title: string
    description: ReactNode
    children: ReactNode
}

export const AuthPageCard = ({
    headingId,
    heading,
    title,
    description,
    children,
}: AuthPageCardProps) => {
    return (
        <section aria-labelledby={headingId}>
            <h1 id={headingId} className="sr-only">
                {heading}
            </h1>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </section>
    )
}
