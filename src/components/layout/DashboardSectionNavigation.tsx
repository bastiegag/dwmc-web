import { useSelectedMonth } from '@/shared/month'
import { SectionNavigation } from './SectionNavigation'

const navigation = [
    { name: 'Overview', pathname: '/dashboard' },
    { name: 'Transactions', pathname: '/transactions' },
] as const

export const DashboardSectionNavigation = () => {
    const { month } = useSelectedMonth()
    const search = `?month=${encodeURIComponent(month)}`

    return (
        <SectionNavigation
            ariaLabel="Dashboard sections"
            items={navigation.map(({ name, pathname }) => ({
                name,
                to: { pathname, search },
            }))}
        />
    )
}
