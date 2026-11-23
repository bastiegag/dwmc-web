import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type StackDirection = 'vertical' | 'horizontal'
type StackGap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12

export interface StackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'align'> {
    direction?: StackDirection
    gap?: StackGap
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    wrap?: boolean
}

const directionClasses: Record<StackDirection, string> = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
}

const gapClasses: Record<StackGap, string> = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12',
}

const alignClasses: Record<NonNullable<StackProps['align']>, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
}

const justifyClasses: Record<NonNullable<StackProps['justify']>, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
    (
        { className, direction = 'vertical', gap = 4, align, justify, wrap = false, ...props },
        ref,
    ) => (
        <div
            ref={ref}
            className={cn(
                directionClasses[direction],
                gapClasses[gap],
                align && alignClasses[align],
                justify && justifyClasses[justify],
                wrap ? 'flex-wrap' : 'flex-nowrap',
                className,
            )}
            {...props}
        />
    ),
)

Stack.displayName = 'Stack'
