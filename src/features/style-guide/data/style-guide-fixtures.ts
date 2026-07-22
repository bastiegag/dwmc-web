import {
    ChevronLeft,
    ChevronRight,
    CirclePlus,
    Edit3,
    ReceiptText,
    Settings,
    Target,
    Trash2,
    WalletCards,
    X,
    Tags,
} from 'lucide-react'
import {
    createAccount,
    createBudget,
    createCategory,
    createSection,
    createTransaction,
} from '@/test/fixtures/domain'

export const styleGuideSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'tokens', label: 'Design tokens' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'forms', label: 'Form controls' },
    { id: 'cards', label: 'Cards and surfaces' },
    { id: 'feedback', label: 'Feedback and status' },
    { id: 'navigation', label: 'Navigation and layout' },
    { id: 'data', label: 'Data display' },
    { id: 'states', label: 'States' },
    { id: 'icons', label: 'Icons' },
    { id: 'responsive', label: 'Responsive behavior' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'theme', label: 'Theme support' },
]

export const styleGuideAccounts = [
    createAccount({ id: 'a1', name: 'Checking', currentBalance: 1250.75, icon: 'wallet' }),
    createAccount({
        id: 'a2',
        name: 'Savings',
        currentBalance: 8200.12,
        goal: 10000,
        icon: 'banknote',
    }),
]

export const styleGuideBudget = createBudget({
    amount: 800,
    spent: 560,
    remaining: 240,
    progress: 70,
    isOverBudget: false,
})

export const styleGuideTransaction = createTransaction({
    amount: 64.25,
    merchant: 'Corner Cafe',
    note: 'Lunch with product team',
})

export const styleGuideIcons = [
    { label: 'Navigation previous', icon: ChevronLeft },
    { label: 'Navigation next', icon: ChevronRight },
    { label: 'Add', icon: CirclePlus },
    { label: 'Edit', icon: Edit3 },
    { label: 'Delete', icon: Trash2 },
    { label: 'Close', icon: X },
    { label: 'Account', icon: WalletCards },
    { label: 'Transaction', icon: ReceiptText },
    { label: 'Budget', icon: Target },
    { label: 'Category', icon: Tags },
    { label: 'Settings', icon: Settings },
]

export const styleGuideSpendingChartData = [
    { month: 'Jan', amount: 420 },
    { month: 'Feb', amount: 560 },
    { month: 'Mar', amount: 390 },
    { month: 'Apr', amount: 680 },
]

export const styleGuideCategory = createCategory({ name: 'Groceries', icon: 'shopping-cart' })
export const styleGuideSection = createSection({ name: 'Food', color: '#22c55e' })
