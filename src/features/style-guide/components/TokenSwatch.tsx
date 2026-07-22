import { cn } from '@/lib/utils'

interface TokenSwatchProps {
    name: string
    cssVar: string
    value?: string
    className?: string
}

export const TokenSwatch = ({ name, cssVar, value, className }: TokenSwatchProps) => {
    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className={cn('mb-3 h-14 rounded-md border', className)} />
            <div className="space-y-1 text-xs">
                <div className="font-medium">{name}</div>
                <div className="text-muted-foreground">{cssVar}</div>
                {value ? (
                    <div className="font-mono text-[11px] text-muted-foreground">{value}</div>
                ) : null}
            </div>
        </div>
    )
}
