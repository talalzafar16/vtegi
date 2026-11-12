import {
  Document,
  Font,
  Image,
  Page,
  renderToBuffer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { formatPrice } from '@/lib/format'

import type { QuoteDocument } from './document'

// The quote PDF, laid out like VTEGI's Word template: red title bands, grey label cells, Arial-like
// type (Helvetica is built into PDF readers, so no font files are needed).

// Never hyphenate ("month-ly"); whole words wrap instead.
Font.registerHyphenationCallback((word) => [word])

const red = '#C00000'
const ink = '#333333'
const grey = '#D9D9D9'
const line = '#BFBFBF'

const s = StyleSheet.create({
  page: { padding: 36, paddingBottom: 56, fontFamily: 'Helvetica', fontSize: 9, color: ink },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 190 },
  company: { textAlign: 'right', gap: 2 },
  companyName: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#000000', marginBottom: 2 },
  band: {
    backgroundColor: red,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  title: { marginTop: 18, fontSize: 14, textAlign: 'center' },
  boxes: { flexDirection: 'row', gap: 12, marginTop: 12 },
  box: { borderWidth: 1, borderColor: line },
  half: { flex: 1 },
  row: { flexDirection: 'row', borderTopWidth: 1, borderColor: line },
  label: {
    width: 92,
    backgroundColor: grey,
    color: red,
    fontFamily: 'Helvetica-Bold',
    padding: 4,
  },
  value: { flex: 1, padding: 4 },
  section: { marginTop: 16 },
  table: { borderWidth: 1, borderColor: line, borderTopWidth: 0 },
  th: { backgroundColor: grey, fontFamily: 'Helvetica-Bold', fontSize: 8, padding: 4 },
  td: { padding: 4 },
  totals: { marginTop: 10, marginLeft: 'auto', width: 250, borderWidth: 1, borderColor: line },
  totalLabel: { flex: 1, backgroundColor: grey, fontFamily: 'Helvetica-Bold', padding: 4 },
  totalValue: { width: 100, padding: 4, textAlign: 'right' },
  grand: { backgroundColor: red, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },
  small: { fontSize: 8, color: '#666666', marginTop: 10, lineHeight: 1.4 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666666',
  },
})

/** Columns of the quotation table: [heading, width, align]. */
const columns = [
  ['#', 18, 'left'],
  ['Part Number', 92, 'left'],
  ['Item & Description', undefined, 'left'],
  ['Site Location', 64, 'left'],
  ['No. Months', 44, 'right'],
  ['Qty', 30, 'right'],
  ['Unit Price', 62, 'right'],
  ['Extended Price', 70, 'right'],
] as const

const cellStyle = (index: number) => {
  const [, width, align] = columns[index]
  return width ? { width, textAlign: align } : { flex: 1, textAlign: align }
}

function LabelRow({
  label,
  value,
  first,
}: {
  label: string
  value: string | null
  first?: boolean
}) {
  return (
    <View style={[s.row, first ? { borderTopWidth: 0 } : {}]}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value || '—'}</Text>
    </View>
  )
}

function TotalRow({ label, value, grand }: { label: string; value: string; grand?: boolean }) {
  return (
    <View style={[s.row, { borderTopWidth: grand ? 1 : 0 }]}>
      <Text style={[s.totalLabel, grand ? s.grand : {}]}>{label}</Text>
      <Text style={[s.totalValue, grand ? s.grand : {}]}>{value}</Text>
    </View>
  )
}

function QuotePdf({ quote, logo }: { quote: QuoteDocument; logo: Buffer }) {
  const { company, billTo, line: item, notes } = quote
  const cells = [
    '1',
    item.partNumber,
    null, // description, rendered below with brand and term
    item.site ?? '—',
    item.months ? String(item.months) : '—',
    String(item.quantity),
    formatPrice(item.unitPrice),
    formatPrice(item.extended),
  ]

  return (
    <Document title={`Quote ${quote.number}`} author={company.name}>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          <Image src={{ data: logo, format: 'png' }} style={s.logo} />
          <View style={s.company}>
            <Text style={s.companyName}>{company.name}</Text>
            {company.duns && <Text>Duns #: {company.duns}</Text>}
            {company.taxId && <Text>Tax ID: {company.taxId}</Text>}
            {company.address.split('\n').map((addressLine) => (
              <Text key={addressLine}>{addressLine}</Text>
            ))}
          </View>
        </View>

        <Text style={[s.band, s.title]}>Price Quotation</Text>

        <View style={s.boxes}>
          <View style={[s.box, s.half]}>
            <Text style={s.band}>Bill To</Text>
            <LabelRow label="Attn:" value={billTo.attn} first />
            <LabelRow label="Company Name:" value={billTo.company} />
            <LabelRow label="Company Address:" value={billTo.address} />
            <LabelRow label="Email:" value={billTo.email} />
            <LabelRow label="Phone:" value={billTo.phone} />
          </View>
          <View style={[s.box, s.half, { alignSelf: 'flex-start' }]}>
            <LabelRow label="QUO#:" value={quote.number} first />
            <LabelRow label="QUO Date:" value={quote.date} />
            <LabelRow label="Expired Date:" value="N/A" />
            <LabelRow label="Salesperson:" value={quote.salesperson} />
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.band}>Quotation</Text>
          <View style={s.table}>
            <View style={{ flexDirection: 'row' }}>
              {columns.map(([heading], i) => (
                <Text key={heading} style={[s.th, cellStyle(i)]}>
                  {heading}
                </Text>
              ))}
            </View>
            <View style={[s.row, { alignItems: 'flex-start' }]}>
              {cells.map((cell, i) =>
                i === 2 ? (
                  <View key={i} style={[s.td, cellStyle(i)]}>
                    <Text>{item.description}</Text>
                    {item.brand && <Text style={{ color: '#666666' }}>Brand: {item.brand}</Text>}
                    {item.term && <Text style={{ color: '#666666' }}>Term: {item.term}</Text>}
                  </View>
                ) : (
                  <Text key={i} style={[s.td, cellStyle(i), i === 1 ? { fontSize: 8 } : {}]}>
                    {cell}
                  </Text>
                ),
              )}
            </View>
          </View>
        </View>

        <View style={s.totals}>
          <TotalRow label="Subtotal" value={formatPrice(quote.subtotal)} />
          <TotalRow
            label={
              quote.discountPercent ? `Volume discount (${quote.discountPercent}%)` : 'Discount'
            }
            value={quote.discount ? `-${formatPrice(quote.discount)}` : formatPrice(0)}
          />
          <TotalRow label="Total sales tax" value="Not included" />
          <TotalRow label="Grand Total Price" value={formatPrice(quote.total)} grand />
        </View>

        <View style={[s.section, s.box]} wrap={false}>
          <Text style={s.band}>Notes</Text>
          <LabelRow label="Delivery:" value={notes.delivery} first />
          <LabelRow label="End User:" value={notes.endUser} />
          <LabelRow label="End User's Email:" value={notes.endUserEmail} />
          <LabelRow label="Delivery Location:" value={notes.location} />
          {notes.customer && <LabelRow label="Customer Notes:" value={notes.customer} />}
        </View>

        <Text style={s.small}>
          Prices are in US dollars and based on current distributor pricing. Shipping and sales tax
          are not included and are confirmed when you place your order. To order or ask a question,
          reply to the email this quote came with or call {company.phone}.
        </Text>

        <View style={s.footer} fixed>
          <Text>
            {company.name} · {company.email} · {company.phone}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${quote.number} · Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

/** The quote as a PDF file, ready to attach to an email. */
export async function renderQuotePdf(quote: QuoteDocument) {
  const logo = await readFile(path.join(process.cwd(), 'public', 'brand', 'vtegi-logo-full.png'))
  return renderToBuffer(<QuotePdf quote={quote} logo={logo} />)
}
