import type { SelectField } from 'payload'

/** Icon names the website knows how to render (mapped to Lucide icons in the frontend). */
export const iconOptions = [
  { label: 'Government (landmark)', value: 'landmark' },
  { label: 'Business (building)', value: 'building' },
  { label: 'Education (graduation cap)', value: 'graduation-cap' },
  { label: 'Healthcare (heart pulse)', value: 'heart-pulse' },
  { label: 'Managed IT (headset)', value: 'headset' },
  { label: 'Store (cart)', value: 'cart' },
  { label: 'Servers', value: 'server' },
  { label: 'Data center', value: 'database' },
  { label: 'Network', value: 'network' },
  { label: 'Security (shield)', value: 'shield' },
  { label: 'Communications (phone)', value: 'phone' },
  { label: 'Geospatial (map)', value: 'map' },
  { label: 'Support (wrench)', value: 'wrench' },
  { label: 'Computers (laptop)', value: 'laptop' },
  { label: 'Cables', value: 'cable' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Continuity (life buoy)', value: 'life-buoy' },
  { label: 'Marketing (megaphone)', value: 'megaphone' },
  { label: 'Operations (settings)', value: 'settings' },
  { label: 'Productivity (briefcase)', value: 'briefcase' },
] as const

export const iconField: SelectField = {
  name: 'icon',
  type: 'select',
  required: true,
  options: [...iconOptions],
  admin: { position: 'sidebar' },
}
