import { useMemo } from 'react'
import { AlertCircle, Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    DatePicker,
    Progress,
    RadioGroup,
    RadioGroupItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@/components/ui'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { PageHeader, ThemeToggle } from '@/components/layout'
import { PrimaryActionProvider, usePrimaryAction } from '@/shared/primary-action'
import { MonthNavigator } from '@/shared/month'
import { formatCurrency } from '@/lib/format-currency'
import { formatMonthLabel } from '@/shared/month'
import { useTheme } from '@/components/layout/useTheme'
import { AccountCard, EmptyAccountsState } from '@/features/accounts/components'
import { BudgetCard } from '@/features/budgets/components'
import { FormError, FormSubmitButton, PasswordField, TextField } from '@/components/form'
import { ComponentPreview, StyleGuideNav, StyleGuideSection, TokenSwatch } from '../components'
import {
    styleGuideAccounts,
    styleGuideBudget,
    styleGuideCategory,
    styleGuideIcons,
    styleGuideSpendingChartData,
    styleGuideTransaction,
} from '../data/style-guide-fixtures'
import { Chart } from '@/components/ui/chart'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { TransactionItem } from '@/features/transactions/components/TransactionItem'
import { toast } from 'sonner'

const OverviewPreview = () => {
    const { theme } = useTheme()
    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                    Development and design reference for the current UI foundation.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="info">Protected route</Badge>
                    <Badge variant="secondary">Development reference</Badge>
                    <Badge variant="outline">Theme: {theme}</Badge>
                </div>
                <p>
                    Use the canonical components from src/components and feature folders. This page
                    only documents them.
                </p>
            </CardContent>
        </Card>
    )
}

const PrimaryActionPreview = () => {
    usePrimaryAction({
        label: 'Add preview item',
        onClick: () => undefined,
        isVisible: true,
    })
    return null
}

const TOCPageShell = () => {
    const previewMonth = useMemo(() => formatMonthLabel('2026-06'), [])
    return (
        <PrimaryActionProvider>
            <PrimaryActionPreview />
            <div className="space-y-10">
                <section id="overview" className="scroll-mt-24 space-y-4">
                    <PageHeader
                        id="style-guide-heading"
                        title="Style Guide"
                        description="Current design system, components, tokens, states, and layout references."
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <ThemeToggle />
                        <Badge variant="outline">Viewport ready</Badge>
                        <Badge variant="secondary">Prefer canonical imports</Badge>
                    </div>
                    <OverviewPreview />
                </section>

                <StyleGuideSection
                    id="tokens"
                    title="Design tokens"
                    description="Semantic tokens from the live theme implementation."
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <TokenSwatch
                            name="background"
                            cssVar="--background"
                            className="bg-background"
                        />
                        <TokenSwatch
                            name="foreground"
                            cssVar="--foreground"
                            className="bg-foreground"
                        />
                        <TokenSwatch name="primary" cssVar="--primary" className="bg-primary" />
                        <TokenSwatch
                            name="secondary"
                            cssVar="--secondary"
                            className="bg-secondary"
                        />
                        <TokenSwatch name="muted" cssVar="--muted" className="bg-muted" />
                        <TokenSwatch name="accent" cssVar="--accent" className="bg-accent" />
                        <TokenSwatch
                            name="destructive"
                            cssVar="--destructive"
                            className="bg-destructive"
                        />
                        <TokenSwatch name="success" cssVar="--success" className="bg-success" />
                        <TokenSwatch name="warning" cssVar="--warning" className="bg-warning" />
                        <TokenSwatch name="info" cssVar="--info" className="bg-info" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <ComponentPreview
                            title="Typography"
                            description="Use the existing Geist stack and heading scale."
                        >
                            <div className="space-y-2">
                                <div className="text-3xl font-bold tracking-tight">
                                    Hero heading
                                </div>
                                <div className="text-2xl font-semibold tracking-tight">
                                    H1 / page heading
                                </div>
                                <div className="text-xl font-semibold tracking-tight">
                                    H2 / section heading
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Body and muted text follow the app's base styles.
                                </div>
                                <div className="font-mono text-sm">Monospace code sample</div>
                            </div>
                        </ComponentPreview>
                        <ComponentPreview
                            title="Spacing"
                            description="Representative spacing scale from Tailwind."
                        >
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 6, 8, 10, 12, 16].map((size) => (
                                    <div key={size} className="flex items-center gap-3">
                                        <span className="w-10 text-xs text-muted-foreground">
                                            {size}
                                        </span>
                                        <div
                                            className={`h-3 rounded-full bg-primary/20`}
                                            style={{ width: `${size * 8}px` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </ComponentPreview>
                        <ComponentPreview
                            title="Radius"
                            description="The app uses the radius token and derived levels."
                        >
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                {[
                                    { label: 'sm', className: 'rounded-sm' },
                                    { label: 'md', className: 'rounded-md' },
                                    { label: 'lg', className: 'rounded-lg' },
                                    { label: 'xl', className: 'rounded-xl' },
                                    { label: '2xl', className: 'rounded-2xl' },
                                    { label: '3xl', className: 'rounded-3xl' },
                                    {
                                        label: '4xl',
                                        className: 'rounded-[calc(var(--radius)*2.6)]',
                                    },
                                    { label: 'full', className: 'rounded-full' },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className={`${item.className} border bg-muted p-3 text-center`}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </ComponentPreview>
                        <ComponentPreview
                            title="Borders and shadows"
                            description="Document the exact shadows that exist today."
                        >
                            <div className="space-y-3">
                                <div className="rounded-md border border-input p-3">
                                    Default border
                                </div>
                                <div className="rounded-md border border-foreground/50 p-3">
                                    Emphasized border
                                </div>
                                <div className="rounded-md border p-3 shadow-sm">Card shadow</div>
                                <div className="rounded-md border p-3">
                                    Focus ring via keyboard tab
                                </div>
                            </div>
                        </ComponentPreview>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="buttons"
                    title="Buttons"
                    description="Canonical button variants, sizes, and composition examples."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="link">Link</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <ComponentPreview title="Sizes">
                            <div className="flex flex-wrap gap-3">
                                <Button size="sm">Small</Button>
                                <Button>Default</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon" aria-label="Add item">
                                    <Plus className="size-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </ComponentPreview>
                        <ComponentPreview title="Loading and icon examples">
                            <div className="flex flex-wrap gap-3">
                                <FormSubmitButton isLoading loadingText="Saving...">
                                    Save changes
                                </FormSubmitButton>
                                <Button variant="outline">
                                    <Plus className="size-4" aria-hidden="true" />
                                    Leading icon
                                </Button>
                                <Button variant="outline">
                                    Trailing icon
                                    <Plus className="size-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </ComponentPreview>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="forms"
                    title="Form controls"
                    description="Inputs, toggles, selects, and local form elements."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <ComponentPreview title="Text field">
                            <TextField id="name" label="Name" placeholder="Jane Doe" />
                        </ComponentPreview>
                        <ComponentPreview title="Password field">
                            <PasswordField
                                id="password"
                                label="Password"
                                placeholder="Enter password"
                            />
                        </ComponentPreview>
                        <ComponentPreview title="Form error">
                            <FormError message="This field is required." />
                        </ComponentPreview>
                        <ComponentPreview title="Form submit button">
                            <FormSubmitButton>Save changes</FormSubmitButton>
                        </ComponentPreview>
                        <ComponentPreview title="Select">
                            <Select defaultValue="one">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pick one" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one">One</SelectItem>
                                    <SelectItem value="two">Two</SelectItem>
                                </SelectContent>
                            </Select>
                        </ComponentPreview>
                        <ComponentPreview title="Textarea">
                            <Textarea defaultValue="Notes can live here." />
                        </ComponentPreview>
                        <ComponentPreview title="Checkbox">
                            <div className="flex items-center gap-2">
                                <Checkbox defaultChecked />
                                <span className="text-sm">Checked</span>
                            </div>
                        </ComponentPreview>
                        <ComponentPreview title="Switch">
                            <div className="flex items-center gap-2">
                                <Switch defaultChecked />
                                <span className="text-sm">Enabled</span>
                            </div>
                        </ComponentPreview>
                        <ComponentPreview title="Radio group">
                            <RadioGroup defaultValue="a" className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem id="style-guide-radio-a" value="a" />
                                    <label htmlFor="style-guide-radio-a">A</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem id="style-guide-radio-b" value="b" />
                                    <label htmlFor="style-guide-radio-b">B</label>
                                </div>
                            </RadioGroup>
                        </ComponentPreview>
                        <ComponentPreview title="Date picker">
                            <DatePicker date={new Date()} onSelect={() => undefined} />
                        </ComponentPreview>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="cards"
                    title="Cards and surfaces"
                    description="Shared card anatomy plus feature-card previews."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Card with title</CardTitle>
                                <CardDescription>Basic surface and header pattern.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Cards use the same border, radius, and shadow across the app.
                            </CardContent>
                        </Card>
                        <BudgetCard
                            budget={styleGuideBudget}
                            onEdit={() => undefined}
                            onArchive={() => undefined}
                        />
                    </div>
                    <ComponentPreview
                        title="Tabs"
                        description="Use tabs for switching between related views without leaving the page."
                    >
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                                <Card>
                                    <CardContent className="pt-6 text-sm text-muted-foreground">
                                        Overview tab content.
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="details">
                                <Card>
                                    <CardContent className="pt-6 text-sm text-muted-foreground">
                                        Details tab content.
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </ComponentPreview>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {styleGuideAccounts.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onEdit={() => undefined}
                                onArchive={() => undefined}
                            />
                        ))}
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <SummaryCard
                            label="Net worth"
                            value={4382.12}
                            subtitle="This month"
                            icon={<AlertCircle className="size-4" aria-hidden="true" />}
                        />
                        <TransactionItem
                            transaction={styleGuideTransaction}
                            onEdit={() => undefined}
                            onArchive={() => undefined}
                        />
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="feedback"
                    title="Feedback and status"
                    description="Alerts, loading, empty, and retry patterns."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Alert variant="success">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Operation completed.</AlertDescription>
                        </Alert>
                        <Alert variant="warning">
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>Something needs attention.</AlertDescription>
                        </Alert>
                        <Alert variant="info">
                            <AlertTitle>Info</AlertTitle>
                            <AlertDescription>Contextual guidance.</AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Something went wrong.</AlertDescription>
                        </Alert>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => toast.success('Preview success toast')}
                        >
                            Trigger success toast
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => toast('Preview neutral toast')}
                        >
                            Trigger neutral toast
                        </Button>
                        <Button type="button" variant="outline">
                            Retry action
                        </Button>
                    </div>
                    <LoadingSpinner aria-label="Loading example" />
                    <ComponentPreview title="Empty state">
                        <EmptyAccountsState />
                    </ComponentPreview>
                </StyleGuideSection>

                <StyleGuideSection
                    id="navigation"
                    title="Navigation and layout"
                    description="Shared month and action patterns."
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <MonthNavigator />
                        <Badge variant="outline">{previewMonth}</Badge>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="data"
                    title="Data display"
                    description="Currency, labels, progress, and chart examples."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <div className="text-2xl font-semibold">
                                    {formatCurrency(styleGuideTransaction.amount)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Positive: {formatCurrency(1250.25)} · Negative:{' '}
                                    {formatCurrency(-48.9)} · Zero: {formatCurrency(0)}
                                </div>
                                <Badge variant="secondary">Expense</Badge>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Progress
                                    value={styleGuideBudget.progress}
                                    indicatorClassName="bg-success"
                                />
                                <div className="text-sm text-muted-foreground">
                                    {styleGuideBudget.remaining >= 0
                                        ? `${formatCurrency(styleGuideBudget.remaining)} remaining`
                                        : `Over by ${formatCurrency(Math.abs(styleGuideBudget.remaining))}`}
                                </div>
                            </CardContent>
                        </Card>
                        <Chart data={styleGuideSpendingChartData} xKey="month" yKey="amount" />
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Badge>{styleGuideCategory.name}</Badge>
                                <div className="text-sm text-muted-foreground">
                                    Category, account, and transaction labels reuse feature data
                                    shape. Month label: {previewMonth}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="states"
                    title="States"
                    description="Selected, active, disabled, archived, and over-budget examples."
                >
                    <div className="flex flex-wrap gap-3">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Selected</Badge>
                        <Badge variant="outline">Disabled</Badge>
                        <Badge variant="warning">Archived</Badge>
                        <Badge variant="destructive">Over budget</Badge>
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="icons"
                    title="Icons"
                    description="Current icon library: lucide-react."
                >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                        {styleGuideIcons.map((item) => {
                            const Icon = item.icon
                            return (
                                <div
                                    key={item.label}
                                    className="rounded-lg border bg-card p-3 text-center shadow-sm"
                                >
                                    <Icon className="mx-auto size-6" aria-hidden="true" />
                                    <div className="mt-2 text-sm font-medium">{item.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </StyleGuideSection>

                <StyleGuideSection
                    id="responsive"
                    title="Responsive behavior"
                    description="This page wraps naturally on small screens and uses a sticky TOC on desktop."
                >
                    <Card>
                        <CardContent className="pt-6">
                            Stacked layout on mobile, two-column layout on desktop.
                        </CardContent>
                    </Card>
                </StyleGuideSection>

                <StyleGuideSection
                    id="accessibility"
                    title="Accessibility"
                    description="Semantic headings, visible focus states, and labeled controls."
                >
                    <Card>
                        <CardContent className="pt-6">
                            Icon-only controls on this page need accessible names. Toast and action
                            previews are local-only.
                        </CardContent>
                    </Card>
                </StyleGuideSection>

                <StyleGuideSection
                    id="theme"
                    title="Theme support"
                    description="The page follows the existing light/dark theme implementation."
                >
                    <Card>
                        <CardContent className="pt-6">
                            Toggle the theme above and re-check every preview for contrast and
                            readability.
                        </CardContent>
                    </Card>
                </StyleGuideSection>
            </div>
        </PrimaryActionProvider>
    )
}

export const StyleGuidePage = () => {
    return (
        <section className="space-y-6" aria-labelledby="style-guide-heading">
            <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-6">
                <div className="mb-6 lg:mb-0">
                    <StyleGuideNav />
                </div>
                <div className="min-w-0">
                    <TOCPageShell />
                </div>
            </div>
        </section>
    )
}

export default StyleGuidePage
