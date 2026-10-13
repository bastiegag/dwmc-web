import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

const labelClasses = 'text-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

const Label = forwardRef<
    ComponentRef<typeof LabelPrimitive.Root>,
    ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelClasses, className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
