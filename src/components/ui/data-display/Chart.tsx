import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'

type Datum = Record<string, string | number>

export interface ChartProps {
    data: Datum[]
    xKey: string
    yKey: string
    className?: string
    title?: string
    description?: string
    color?: string
    locale?: string
    currency?: string
    emptyMessage?: string
}

export const Chart = ({
    data,
    xKey,
    yKey,
    className,
    title,
    description,
    color = 'var(--color-primary)',
    locale = 'en-CA',
    currency,
    emptyMessage = 'No data available.',
}: ChartProps) => {
    const numberFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                ...(currency
                    ? { style: 'currency' as const, currency }
                    : { maximumFractionDigits: 2 }),
            }),
        [locale, currency],
    )

    const axisFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                notation: 'compact',
                maximumFractionDigits: 1,
            }),
        [locale],
    )

    const formatValue = (value: number) => numberFormatter.format(value)

    const hasData = data.some(
        (item) => typeof item[yKey] === 'number' && Number.isFinite(item[yKey]),
    )

    return (
        <div
            className={cn(
                'w-full min-w-0 rounded-lg border border-border',
                'bg-card p-4',
                className,
            )}
        >
            {(title || description) && (
                <div className="mb-4 space-y-1">
                    {title && <h3 className="text-sm font-semibold">{title}</h3>}

                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            )}

            {!hasData ? (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </div>
            ) : (
                <div className="h-64 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart
                            data={data}
                            accessibilityLayer
                            margin={{
                                top: 8,
                                right: 8,
                                left: -16,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="var(--color-border)"
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey={xKey}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--color-muted-foreground)',
                                    fontSize: 12,
                                }}
                                tickMargin={8}
                                minTickGap={16}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--color-muted-foreground)',
                                    fontSize: 12,
                                }}
                                tickFormatter={(value: number) => axisFormatter.format(value)}
                                width={56}
                            />

                            <Tooltip
                                cursor={{
                                    fill: 'var(--color-muted)',
                                    fillOpacity: 0.5,
                                }}
                                contentStyle={{
                                    backgroundColor: 'var(--color-popover)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-popover-foreground)',
                                    fontSize: 12,
                                }}
                                labelStyle={{
                                    color: 'var(--color-foreground)',
                                    fontWeight: 600,
                                }}
                                formatter={(value) =>
                                    typeof value === 'number'
                                        ? formatValue(value)
                                        : String(value ?? '')
                                }
                            />

                            <Bar
                                dataKey={yKey}
                                fill={color}
                                maxBarSize={48}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
