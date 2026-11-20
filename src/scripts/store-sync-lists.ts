// Refreshes Distributor Lists (the Store Categories dropdowns) and prints a report. Run: pnpm store:sync
// Same sync as the admin's "Sync now" button; the run is recorded in Sync History.
import { getPayload } from 'payload'

import config from '@payload-config'
import { runSync, startSync } from '@/features/store/sync'

const payload = await getPayload({ config })

const run = await startSync(payload)
if (!run) {
  console.log('A sync is already running (see Store → Sync History).')
  process.exit(1)
}

const report = await runSync(payload, run.id, (message) => process.stdout.write(`\r${message}`))
console.log()
if (!report) {
  console.log('Sync failed: see the error in Store → Sync History.')
  process.exit(1)
}

const top = (map: Map<string, number>, n: number) =>
  [...map]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => `${name} (${count})`)
    .join(', ')

console.log(`\n${report.added} new names saved.`)
console.log('\nINGRAM CATEGORIES → top subcategories')
for (const [category, count] of [...report.ingramCategories].sort((a, b) => b[1] - a[1])) {
  console.log(
    `- ${category} (${count}): ${top(report.subCategories.get(category) ?? new Map(), 6)}`,
  )
}
console.log(`\nINGRAM BRANDS (top 40): ${top(report.ingramBrands, 40)}`)
console.log(`\nPAX8 BRANDS (top 60 of ${report.pax8Brands.size}): ${top(report.pax8Brands, 60)}`)
process.exit(0)
