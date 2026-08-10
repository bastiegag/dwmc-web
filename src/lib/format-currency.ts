const formatter = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2,
})

export const formatCurrency = (value: number): string => {
    return formatter.format(value)
}

export const sumCurrency = (values: number[]): number => {
    const cents = values.reduce((total, value) => total + Math.round(value * 100), 0)
    return cents / 100
}

export default formatCurrency
