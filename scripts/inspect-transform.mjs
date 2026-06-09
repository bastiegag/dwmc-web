import { createServer } from 'vite'

async function inspect(paths) {
    const server = await createServer({ logLevel: 'error' })
    try {
        for (const p of paths) {
            console.log('\n===== TRANSFORM:', p, '=====')
            const res = await server.transformRequest(p, { ssr: true })
            if (res && typeof res === 'object' && 'code' in res) console.log(res.code)
            else console.log(res)
        }
    } finally {
        await server.close()
    }
}

const files = [
    '/src/features/transactions/components/TransactionItem.tsx',
    '/src/features/transactions/pages/TransactionsPage.tsx',
    '/src/features/transactions/components/TransactionForm.tsx',
]

inspect(files).catch((e) => {
    console.error(e)
    process.exit(1)
})
