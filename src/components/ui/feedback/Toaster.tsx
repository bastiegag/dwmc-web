import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    TriangleAlertIcon,
    Loader2Icon,
} from 'lucide-react'
import { useTheme } from '@/shared/theme'

const Toaster = (props: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            toastOptions={{
                classNames: {
                    content: '!min-w-0 !flex-1',
                    title: '!text-body-sm !font-semibold !leading-none !mb-1',
                    description: '!text-caption !text-inherit',
                    toast: 'relative flex w-full !items-start !gap-2 !rounded-lg !border-2 !p-3 !font-sans !text-base !opacity-100 !shadow-none',
                    success: '!border-success-border !bg-[var(--success-subtle)] !text-success',
                    error: '!border-destructive !bg-[var(--destructive-subtle)] !text-destructive',
                    warning: '!border-warning !bg-[var(--warning-subtle)] !text-warning',
                    info: '!border-info !bg-[var(--info-subtle)] !text-info',
                },
            }}
            icons={{
                success: <CircleCheckIcon className="size-5" aria-hidden="true" />,
                info: <InfoIcon className="size-5" aria-hidden="true" />,
                warning: <TriangleAlertIcon className="size-5" aria-hidden="true" />,
                error: <CircleXIcon className="size-5" aria-hidden="true" />,
                loading: <Loader2Icon className="size-5 animate-spin" aria-hidden="true" />,
            }}
            style={
                {
                    '--normal-bg': 'var(--default-subtle)',
                    '--normal-text': 'var(--default)',
                    '--normal-border': 'var(--default)',
                    '--success-bg': 'var(--success-subtle)',
                    '--success-border': 'var(--color-green-200)',
                    '--error-bg': 'var(--destructive-subtle)',
                    '--error-border': 'var(--color-red-200)',
                    '--warning-bg': 'var(--warning-subtle)',
                    '--warning-border': 'var(--color-yellow-200)',
                    '--info-bg': 'var(--info-subtle)',
                    '--info-border': 'var(--color-blue-200)',
                    '--border-radius': 'var(--radius)',
                } as CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
