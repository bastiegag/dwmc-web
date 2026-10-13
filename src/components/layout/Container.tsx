import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Container = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('w-full max-w-md', className)} {...props} />
)
