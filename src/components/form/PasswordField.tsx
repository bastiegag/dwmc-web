import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { cn } from '@/lib/utils'

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    id: string
    label: string
    error?: string
    required?: boolean
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ id, label, error, required, className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        return (
            <FormField id={id} label={label} error={error} required={required}>
                <div className="relative">
                    <Input
                        id={id}
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={cn(
                            'pr-10',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className,
                        )}
                        {...props}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </FormField>
        )
    },
)
PasswordField.displayName = 'PasswordField'
