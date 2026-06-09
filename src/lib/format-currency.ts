const formatter = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
    return formatter.format(value)
}

export default formatCurrency
