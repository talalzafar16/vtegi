// Smoke test for the store's distributor connections (read-only). Run: yarn store:check
import { stockSummary } from '@/features/store/stock'
import { ingram, pax8 } from '@/features/store/vendors'

const money = (n: number | null | undefined) => (n == null ? '—' : `$${n.toFixed(2)}`)

async function timed<T>(label: string, run: () => Promise<T>) {
  const start = Date.now()
  const result = await run()
  console.log(`  ${label}: ${Date.now() - start} ms`)
  return result
}

console.log(
  'Ingram Micro configured:',
  ingram.ingramConfigured(),
  '| Pax8 configured:',
  pax8.pax8Configured(),
)

for (const round of [1, 2]) {
  console.log(`\nRound ${round}${round === 2 ? ' (should come from the cache)' : ''}`)

  const laptops = await timed('Ingram catalog page', () =>
    ingram.catalogPage({ category: 'Computer Systems', keyword: 'laptop' }),
  )
  const found = await timed('Ingram price and stock', () =>
    ingram.priceAndStock(laptops.products.map((p) => p.id)),
  )
  if (round === 1) {
    console.log(
      `  "Computer Systems" + "laptop": ${laptops.products.length} current of 50 on page 1:`,
    )
    for (const p of laptops.products.slice(0, 5)) {
      const { cost, stock } = found.get(p.id) ?? {}
      console.log(
        `   - ${p.id} | ${p.brand} | ${p.name.slice(0, 50)} | cost ${money(cost)} | ${stock ? stockSummary(stock) : 'stock unknown'}`,
      )
    }
  }

  const catalog = await timed('Pax8 full catalog', () => pax8.allProducts())
  const m365 = catalog.find((p) => /^Microsoft 365 Business Basic\b/i.test(p.name)) ?? catalog[0]
  const options = await timed('Pax8 pricing', () => pax8.priceOptions(m365.id))
  if (round === 1) {
    console.log(`  ${catalog.length} Pax8 products; pricing for "${m365.name}":`)
    for (const o of options)
      console.log(`   - ${o.label} | per ${o.unit} | cost ${money(o.tiers[0]?.cost)}`)
    console.log(`   lowest monthly cost: ${money(pax8.lowestMonthlyCost(options)?.cost)}`)
    const acronis = catalog.find((p) => p.name === 'Acronis Cyber Protect Cloud')
    if (acronis) {
      const usage = await pax8.priceOptions(acronis.id)
      console.log(
        `  "${acronis.name}" (usage-based): ${usage.length} simple options → ${usage.length ? 'priced' : 'manual quote'}`,
      )
    }
  }
}
process.exit(0)
