export const MAX_MONEY_AMOUNT = '9999999999.99'
export const MAX_MONEY_CENTS = 999_999_999_999n

export const isSupportedMoneyAmount = (value: string | number): boolean => {
    const match = /^(-?)(\d*)(?:\.(\d+))?$/.exec(String(value))
    if (!match) return false

    const [, , wholeDigits, fraction = ''] = match
    if ((!wholeDigits && !fraction) || fraction.length > 2) return false

    const cents = BigInt(wholeDigits || '0') * 100n + BigInt(fraction.padEnd(2, '0') || '0')
    return cents <= MAX_MONEY_CENTS
}
