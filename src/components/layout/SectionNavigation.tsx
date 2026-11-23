import { NavLink, type To } from 'react-router-dom'

import { Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface SectionNavigationItem {
    name: string
    to: To
    end?: boolean
}

export interface SectionNavigationProps {
    ariaLabel: string
    items: readonly SectionNavigationItem[]
    className?: string
}

export const SectionNavigation = ({ ariaLabel, items, className }: SectionNavigationProps) => (
    <nav aria-label={ariaLabel} className={cn('bg-primary px-4 pb-4 text-foreground', className)}>
        <Stack direction="horizontal" gap={2} align="center" justify="center">
            {items.map(({ name, to, end = true }) => (
                <NavLink
                    key={name}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                        cn(
                            // Layout
                            'rounded-full px-4 py-2 text-sm',

                            // Interaction
                            'transition motion-reduce:transition-none',
                            'hover:bg-primary-border/10',

                            // Active
                            isActive &&
                                'bg-primary-border/50 hover:bg-primary-border/50 text-white',
                        )
                    }
                >
                    {name}
                </NavLink>
            ))}
        </Stack>
    </nav>
)
