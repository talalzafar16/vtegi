import {
  Briefcase,
  Building2,
  Cable,
  Cloud,
  Database,
  GraduationCap,
  Headset,
  HeartPulse,
  Landmark,
  Laptop,
  LifeBuoy,
  MapIcon,
  Megaphone,
  Network,
  Phone,
  Server,
  Settings2,
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
  laptop: Laptop,
  cable: Cable,
  cloud: Cloud,
  'life-buoy': LifeBuoy,
  megaphone: Megaphone,
  settings: Settings2,
  briefcase: Briefcase,
} satisfies Record<Solution['icon'], unknown>

export function Icon({ name, ...props }: { name: Solution['icon'] } & LucideProps) {
  const Component = icons[name]
  return <Component aria-hidden {...props} />
}
