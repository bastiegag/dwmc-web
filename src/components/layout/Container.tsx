import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type ContainerProps = HTMLAttributes<HTMLDivElement>

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('w-full max-w-md', className)} {...props} />
    ),
)

Container.displayName = 'Container'
