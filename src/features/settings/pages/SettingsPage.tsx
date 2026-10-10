import { Card } from '@/components/ui/card'
import { ThemePreferenceControl } from '../components/ThemePreferenceControl'

export const SettingsPage = () => (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8" aria-labelledby="settings-heading">
        <div>
            <h1 id="settings-heading" className="text-2xl font-bold">
                Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Configure how the application looks and behaves on this device.
            </p>
        </div>
        <Card
            className="max-w-3xl"
            title={<span className="text-lg">Appearance</span>}
            description="Choose the theme used by the application."
        >
            <ThemePreferenceControl />
        </Card>
    </section>
)

export default SettingsPage
