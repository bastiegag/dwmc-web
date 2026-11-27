import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    TriangleAlertIcon,
    Loader2Icon,
} from 'lucide-react'
import { useTheme } from '@/shared/theme'

const defaultClassNames = {
    content: 'min-w-0! flex-1! z-500!',
    title: 'text-body-sm! font-semibold! leading-none! mb-1!',
    description: 'text-caption! text-inherit!',
    toast: 'relative flex w-full items-start! gap-2! rounded-lg border-2! p-3! font-sans! text-base! opacity-100! shadow-none!',
    default: 'border-default! bg-default-background! text-default-border!',
    success: 'border-success! bg-[var(--success-background)]! text-success-border!',
    error: 'border-destructive! bg-[var(--destructive-background)]! text-destructive-border!',
    warning: 'border-warning! bg-[var(--warning-background)]! text-warning-border!',
    info: 'border-info! bg-[var(--info-background)]! text-info-border!',
}

const defaultIcons = {
    success: <CircleCheckIcon className="size-5" aria-hidden="true" />,
    info: <InfoIcon className="size-5" aria-hidden="true" />,
    warning: <TriangleAlertIcon className="size-5" aria-hidden="true" />,
    error: <CircleXIcon className="size-5" aria-hidden="true" />,
    loading: (
        <Loader2Icon
            className="size-5 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
        />
    ),
}

export const Toaster = ({
    className,
    toastOptions,
    icons,
    theme: themeOverride,
    ...props
}: ToasterProps) => {
    const { theme, toastThemeOverride } = useTheme()
    const activeTheme = themeOverride ?? toastThemeOverride ?? theme ?? 'system'
    const themeClass =
        themeOverride === 'light' || themeOverride === 'dark'
            ? themeOverride
            : themeOverride === undefined
              ? toastThemeOverride
              : undefined

    return (
        <Sonner
            {...props}
            theme={activeTheme}
            className={['toaster group', themeClass, className].filter(Boolean).join(' ')}
            toastOptions={{
                ...toastOptions,
                classNames: {
                    ...defaultClassNames,
                    ...toastOptions?.classNames,
                },
            }}
            icons={{
                ...defaultIcons,
                ...icons,
            }}
        />
    )
}
