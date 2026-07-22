import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'

type Datum = Record<string, string | number>

interface ChartProps {
    data: Datum[]
    xKey: string
    yKey: string
    className?: string
}

export const Chart = ({ data, xKey, yKey, className }: ChartProps) => {
    return (
        <div className={cn('h-64 w-full rounded-lg border bg-card p-4', className)}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey={yKey} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
