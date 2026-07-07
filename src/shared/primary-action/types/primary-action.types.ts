export type PrimaryAction = {
    label: string
    onClick: () => void
    isVisible?: boolean
    disabled?: boolean
    icon?: React.ElementType
}
