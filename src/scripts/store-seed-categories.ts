// Creates Terry's 9 starter categories with drafted mappings; never changes existing ones.
// Run `pnpm store:sync` first so the distributor names exist. Run: pnpm store:seed
import config from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

/** [label, Ingram category, keyword, brand?] */
type Group = [label: string, category: string, keyword: string, brand?: string]
/** [Pax8 brand, include words?, exclude words?] */
type Rule = [brand: string, include?: string[], exclude?: string[]]

type Seed = {
  title: string
  slug: string
  icon: RequiredDataFromCollectionSlug<'store-categories'>['icon']
  description: string
  hardware: Group[]
  software: Rule[]
}

// Licence variants most customers don't need; Terry can remove these words per rule.
const notForResale = ['NFR', 'Trial']
const microsoftVariants = [
  ...notForResale,
  'Student',
  'Faculty',
  'Education',
  'Non-Profit',
  'Charity',
]
const microsoft = (include: string[], exclude: string[] = []): Rule => [
  'Microsoft',
  include,
  [...exclude, ...microsoftVariants],
]
const brands = (...names: string[]): Rule[] => names.map((name) => [name, [], notForResale])

const seeds: Seed[] = [
  {
    title: 'Computer Products',
    slug: 'computer-products',
    icon: 'laptop',
    description: 'Laptops, desktops, workstations, monitors and the accessories that go with them.',
    hardware: [
      ['Laptops', 'Computer Systems', 'laptop'],
      ['Desktops', 'Computer Systems', 'desktop'],
      ['All-in-Ones', 'Computer Systems', 'all-in-one'],
      ['Workstations', 'Computer Systems', 'workstation'],
      ['Tablets', 'Computer Systems', 'tablet'],
      ['Chromebooks', 'Computer Systems', 'chromebook'],
      ['Monitors', 'Displays', 'monitor'],
      ['Docking Stations', 'Accessories', 'docking station'],
      ['Keyboards', 'Input & Output Devices', 'keyboard'],
      ['Mice', 'Input & Output Devices', 'mouse'],
      ['Memory', 'System Components', 'memory'],
      ['Laptop Bags', 'Accessories', 'laptop bag'],
    ],
    software: [microsoft(['Windows'], ['Server'])],
  },
  {
    title: 'Infrastructure',
    slug: 'infrastructure',
    icon: 'server',
    description: 'Servers, storage, racks and cloud platforms for data centers and server rooms.',
    hardware: [
      ['Servers', 'Computer Systems', 'server'],
      ['NAS & Storage Systems', 'Storage Devices', 'NAS'],
      ['Hard Drives', 'Storage Devices', 'hard drive'],
      ['SSDs', 'Storage Devices', 'SSD'],
      ['Racks', 'Power & Rack Equipment', 'rack'],
      ['PDUs', 'Power & Rack Equipment', 'PDU'],
      ['KVM Switches', 'Accessories', 'KVM'],
    ],
    software: [
      microsoft(['Azure', 'Server', 'SQL']),
      ['AWS', [], notForResale],
      ['Google', ['Cloud Platform'], notForResale],
      ...brands('Nerdio', 'Wasabi'),
    ],
  },
  {
    title: 'IT Operations',
    slug: 'it-operations',
    icon: 'settings',
    description:
      'Device management, monitoring and IT service tools, plus warranties and service plans.',
    hardware: [['Warranties & Service Plans', 'Services and Warranties', 'warranty']],
    software: [
      microsoft(['Intune']),
      ...brands(
        'ConnectWise',
        'SuperOps',
        'Liongard',
        'CloudRadial',
        'Rewst',
        'Inforcer',
        'Addigy',
        'IBM',
        'GoTo',
        'Printix',
        'MontyCloud',
        'BitTitan',
        'Augmentt Technologies Inc',
      ),
    ],
  },
  {
    title: 'Network',
    slug: 'network',
    icon: 'network',
    description: 'Switches, routers, wireless access points and the parts that connect them.',
    hardware: [
      ['Switches', 'Network Devices', 'switch'],
      ['Routers', 'Network Devices', 'router'],
      ['Wireless Access Points', 'Network Devices', 'access point'],
      ['Transceivers', 'Network Devices', 'transceiver'],
      ['Cellular Modems', 'Network Devices', 'modem'],
    ],
    software: [
      ['WatchGuard', ['AP1', 'AP2', 'AP3', 'AP4', 'Wi-Fi'], notForResale],
      ...brands('Auvik', 'Domotz', 'Timus Networks Inc.'),
    ],
  },
  {
    title: 'Productivity',
    slug: 'productivity',
    icon: 'briefcase',
    description:
      'Microsoft 365, Google Workspace and collaboration tools, plus the devices people use every day.',
    hardware: [
      ['Headsets', 'Accessories', 'headset'],
      ['Webcams', 'Communications', 'webcam'],
      ['Speakerphones', 'Communications', 'speakerphone'],
      ['Video Conferencing', 'Communications', 'video conferencing'],
      ['IP Phones', 'Communications', 'phone'],
      ['Printers', 'Printers & Office Equipment', 'printer'],
      ['Scanners', 'Imaging Devices', 'scanner'],
      ['Toner & Supplies', 'Supplies & Media', 'toner'],
      ['Projectors', 'Presentation Devices', 'projector'],
    ],
    software: [
      microsoft(
        [
          'Microsoft 365',
          'Office 365',
          'Teams',
          'Exchange',
          'SharePoint',
          'OneDrive',
          'Visio',
          'Project',
          'Planner',
          'Copilot',
          'Power BI',
          'Power Apps',
          'Power Automate',
          'Clipchamp',
          'Viva',
        ],
        ['Defender', 'Dynamics'],
      ),
      ['Google', ['Workspace'], notForResale],
      ...brands('Egnyte', 'Foxit', 'Nitro', 'airSlate', 'Call2Teams', 'SIPPIO'),
    ],
  },
  {
    title: 'Security',
    slug: 'security',
    icon: 'shield',
    description:
      'Firewalls, cameras and access control, plus endpoint, email and identity protection.',
    hardware: [
      ['Firewalls', 'Security Products', 'firewall'],
      ['Security Cameras', 'Physical Security', 'camera'],
      ['Video Recorders', 'Physical Security', 'recorder'],
      ['Access Control & Card Readers', 'Physical Security', 'access control'],
      ['Locks', 'Physical Security', 'lock'],
      ['Privacy Filters', 'Accessories', 'privacy filter'],
    ],
    software: [
      microsoft(['Defender', 'Entra', 'Purview', 'Sentinel', 'Information Protection']),
      ...brands(
        'WatchGuard',
        'CrowdStrike',
        'SentinelOne',
        'Bitdefender',
        'Sophos',
        'Webroot',
        'Threatdown Powered by Malwarebytes',
        'TrendMicro',
        'Symantec',
        'Check Point',
        'Proofpoint',
        'Hornetsecurity by Proofpoint',
        'Ironscales',
        'Perception Point',
        'Vade',
        'Valimail',
        'EasyDMARC',
        'Red Sift',
        'Echoworx',
        'Sectigo',
        '1Password',
        'Keeper Security',
        'LastPass',
        'N-able Passportal',
        'Nord Security',
        'Lookout',
        'Halcyon',
        'Blackpoint Cyber',
        'Blumira',
        'Cynet',
        'Todyl',
        'Guardz',
        'Pillr',
        'DNSFilter',
        'DefensX',
        'Zero Networks',
        'Island',
        'Absolute',
        'TruGrid',
        'Netwrix',
        'Breach Secure Now',
        'usecure',
        'Phin Security',
        'Horizon3',
        'Vicarius Inc.',
        'ConnectSecure',
        'Compliancy Group',
        'Apptega',
        'Compliance Scorecard',
        'Cynomi',
      ),
    ],
  },
  {
    title: 'Wire and Cables',
    slug: 'wire-and-cables',
    icon: 'cable',
    description: 'Ethernet, fiber, video, USB and power cables, plus patch panels.',
    hardware: [
      ['Ethernet Cables', 'Cables', 'Cat6'],
      ['Fiber', 'Cables', 'fiber'],
      ['HDMI', 'Cables', 'HDMI'],
      ['DisplayPort', 'Cables', 'DisplayPort'],
      ['USB', 'Cables', 'USB'],
      ['Power Cords', 'Cables', 'power cord'],
      ['Patch Panels', 'Cables', 'patch panel'],
    ],
    software: [],
  },
  {
    title: 'Continuity',
    slug: 'continuity',
    icon: 'life-buoy',
    description: 'Backup power, backup storage and cloud backup to keep your organization running.',
    hardware: [
      ['UPS', 'Power & Rack Equipment', 'UPS'],
      ['Surge Protectors', 'Power & Rack Equipment', 'surge'],
      ['Batteries', 'Accessories', 'battery'],
      ['Tape Drives & Media', 'Storage Devices', 'tape'],
      ['External Drives', 'Storage Devices', 'external'],
    ],
    software: [
      microsoft(['Archiving']),
      ...brands(
        'Acronis',
        'Axcient',
        'Arcserve',
        'Veeam',
        'Commvault',
        'Keepit',
        'Redstor',
        'Probax',
        'Dropsuite',
        'AvePoint',
        'Alcion',
        'SkyKick',
      ),
    ],
  },
  {
    title: 'Sales and Marketing',
    slug: 'sales-and-marketing',
    icon: 'megaphone',
    description:
      'CRM, contact center and customer engagement tools, plus point-of-sale and display hardware.',
    hardware: [
      ['Barcode Scanners', 'Data Capture / Point of Sale', 'barcode scanner'],
      ['Receipt & Label Printers', 'Data Capture / Point of Sale', 'receipt printer'],
      ['Mobile Computers', 'Data Capture / Point of Sale', 'mobile computer'],
      ['Digital Signage', 'Displays', 'digital signage'],
      ['Interactive Displays', 'Displays', 'interactive'],
    ],
    software: [
      microsoft([
        'Dynamics 365 Sales',
        'Customer Insights',
        'Customer Service',
        'Contact Center',
        'Copilot for Sales',
      ]),
      ...brands('TruNorth Dynamics', '1Stream', 'Clerk Chat', 'Crewhu', 'Exclaimer', 'CodeTwo'),
    ],
  },
]

const payload = await getPayload({ config })
const context = { disableRevalidate: true }

const { docs: lists } = await payload.find({
  collection: 'distributor-lists',
  limit: 0,
  pagination: false,
})
const missing = new Set<string>()
const idOf = (distributor: 'ingram' | 'pax8', kind: 'category' | 'brand', name: string) => {
  const doc = lists.find((l) => l.distributor === distributor && l.kind === kind && l.name === name)
  if (!doc) missing.add(`${distributor} ${kind}: ${name}`)
  return doc?.id
}

for (const seed of seeds) {
  const { totalDocs } = await payload.count({
    collection: 'store-categories',
    where: { slug: { equals: seed.slug } },
  })
  if (totalDocs > 0) {
    console.log(`= ${seed.title} (exists, left as is)`)
    continue
  }

  const ingramGroups = seed.hardware.flatMap(([label, category, keyword, brand]) => {
    const categoryId = idOf('ingram', 'category', category)
    const brandId = brand ? idOf('ingram', 'brand', brand) : undefined
    return categoryId ? [{ label, category: categoryId, keyword, brand: brandId }] : []
  })
  const pax8Rules = seed.software.flatMap(([brand, includeWords = [], excludeWords = []]) => {
    const brandId = idOf('pax8', 'brand', brand)
    return brandId ? [{ brand: brandId, includeWords, excludeWords }] : []
  })

  await payload.create({
    collection: 'store-categories',
    context,
    data: {
      title: seed.title,
      slug: seed.slug,
      icon: seed.icon,
      description: seed.description,
      visible: true,
      ingramGroups,
      pax8Rules,
    },
  })
  console.log(
    `+ ${seed.title}: ${ingramGroups.length} hardware groups, ${pax8Rules.length} Pax8 rules`,
  )
}

if (missing.size > 0) {
  console.log(
    `\nNot found in Distributor Lists (skipped; run pnpm store:sync):\n  ${[...missing].join('\n  ')}`,
  )
}
process.exit(0)
