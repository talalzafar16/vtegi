import {
  Building2,
  Database,
  GraduationCap,
  Headset,
  HeartPulse,
  Landmark,
  MapIcon,
  Network,
  Phone,
  Server,
  ShieldCheck,
  ShoppingCart,
  Wrench,
  type LucideProps,
} from 'lucide-react'

import type { Solution } from '@/payload-types'

/** Maps the CMS icon field (see fields/icon.ts) to Lucide icons. */
const icons = {
  landmark: Landmark,
  building: Building2,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  headset: Headset,
  cart: ShoppingCart,
  server: Server,
  database: Database,
  network: Network,
  shield: ShieldCheck,
  phone: Phone,
  map: MapIcon,
  wrench: Wrench,
} satisfies Record<Solution['icon'], unknown>

export function Icon({ name, ...props }: { name: Solution['icon'] } & LucideProps) {
  const Component = icons[name]
  return <Component aria-hidden {...props} />
}
