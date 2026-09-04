import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDirectory = join(process.cwd(), 'dist', 'assets')
const warningThreshold = 500 * 1024

const entries = await readdir(assetsDirectory)
const assets = await Promise.all(
    entries.map(async (name) => ({
        name,
        bytes: (await stat(join(assetsDirectory, name))).size,
    })),
)

assets.sort((left, right) => right.bytes - left.bytes)

const formatSize = (bytes) => `${(bytes / 1024).toFixed(1)} kB`
const largeAssets = assets.filter(({ bytes }) => bytes > warningThreshold)

console.log('Production bundle assets:')
for (const asset of assets.slice(0, 10)) {
    console.log(`  ${formatSize(asset.bytes).padStart(10)}  ${asset.name}`)
}

if (largeAssets.length > 0) {
    console.log(`\nAssets above ${formatSize(warningThreshold)}:`)
    for (const asset of largeAssets) {
        console.log(`  ${formatSize(asset.bytes).padStart(10)}  ${asset.name}`)
    }
} else {
    console.log(`\nNo assets above ${formatSize(warningThreshold)}.`)
}
