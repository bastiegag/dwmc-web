import {
    Banknote,
    BriefcaseBusiness,
    Car,
    Coffee,
    Coins,
    CreditCard,
    Dumbbell,
    Gamepad2,
    Gift,
    GraduationCap,
    HeartPulse,
    House,
    Landmark,
    Plane,
    PiggyBank,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Utensils,
    Wallet,
} from 'lucide-react'

export const FINANCE_ICON_REGISTRY = [
    { value: 'wallet', label: 'Wallet', Component: Wallet },
    { value: 'landmark', label: 'Bank', Component: Landmark },
    { value: 'credit-card', label: 'Credit card', Component: CreditCard },
    { value: 'banknote', label: 'Banknote', Component: Banknote },
    { value: 'coins', label: 'Coins', Component: Coins },
    { value: 'piggy-bank', label: 'Piggy bank', Component: PiggyBank },
    { value: 'shopping-cart', label: 'Shopping cart', Component: ShoppingCart },
    { value: 'shopping-bag', label: 'Shopping bag', Component: ShoppingBag },
    { value: 'utensils', label: 'Dining', Component: Utensils },
    { value: 'coffee', label: 'Coffee', Component: Coffee },
    { value: 'house', label: 'Home', Component: House },
    { value: 'car', label: 'Car', Component: Car },
    { value: 'plane', label: 'Travel', Component: Plane },
    { value: 'heart-pulse', label: 'Health', Component: HeartPulse },
    { value: 'gift', label: 'Gift', Component: Gift },
    { value: 'graduation-cap', label: 'Education', Component: GraduationCap },
    { value: 'briefcase-business', label: 'Work', Component: BriefcaseBusiness },
    { value: 'smartphone', label: 'Phone', Component: Smartphone },
    { value: 'gamepad-2', label: 'Games', Component: Gamepad2 },
    { value: 'dumbbell', label: 'Fitness', Component: Dumbbell },
] as const

export type FinanceIconName = (typeof FINANCE_ICON_REGISTRY)[number]['value']

export const isFinanceIconName = (value: unknown): value is FinanceIconName =>
    typeof value === 'string' && FINANCE_ICON_REGISTRY.some((option) => option.value === value)

export const getFinanceIconOption = (value: string) =>
    FINANCE_ICON_REGISTRY.find((option) => option.value === value)
