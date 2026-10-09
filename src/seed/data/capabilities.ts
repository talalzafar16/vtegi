import type { RequiredDataFromCollectionSlug } from 'payload'

type SeedCapability = Omit<RequiredDataFromCollectionSlug<'capabilities'>, 'description'> & {
  description: string
}

const labels = (...items: string[]) => items.map((label) => ({ label }))

export const capabilities: SeedCapability[] = [
  {
    title: 'Virtualization & Systems Engineering',
    slug: 'virtualization',
    icon: 'server',
    summary:
      'Server administration, rebuilds, configuration, and systems implementation planned around your workloads and support needs.',
    description: `VTEGI offers comprehensive virtualization that can increase ROI and reduce downtime by making better use of existing hardware.

Our work spans system engineering, installation, system administration, maintenance, training, help desk and desktop support, hardware and software purchasing, server and system software integration, configuration management, and technical documentation, including integration and testing of network backbone elements such as gateways, routers, and switches. We also design, implement, and support server and system solutions in Microsoft environments.`,
    offerings: labels(
      'Server administration',
      'Server rebuilds & reconfiguration',
      'Systems implementation',
      'Backup & recovery strategies',
      'Security assessments',
      'Network hardware',
      'On-site maintenance agreements',
      'PC repair & upgrades',
    ),
    startingContext: 'Workloads, dependencies, change windows, and who owns support today.',
  },
  {
    title: 'Data Center & Recovery',
    slug: 'data-center',
    icon: 'database',
    summary:
      'Server and storage consolidation, desktop virtualization, capacity planning, and backup and disaster recovery.',
    description: `VTEGI delivers data center and cloud virtualization that improves return on investment, scalability, reliability, and redundancy, while shrinking the footprint you have to manage.

Virtualization allows better use and allocation of resources and better management of capacity and performance. Our certified technicians guide you through installation and train your team on operating the system afterwards.`,
    offerings: labels(
      'Server & storage virtualization',
      'P2V migration & consolidation',
      'Consolidation analysis',
      'Disaster recovery',
      'Desktop & application virtualization',
      'Thin clients',
      'Green IT',
      'On-site maintenance agreements',
    ),
    startingContext:
      'Capacity constraints, recovery priorities, maintenance needs, and migration boundaries.',
  },
  {
    title: 'Network Infrastructure & Security',
    slug: 'network-security',
    icon: 'shield',
    summary:
      'Routing, switching, network design, remote access, monitoring, security assessments, and risk mitigation.',
    description: `We perform assessment and analysis to identify network issues, then deliver solutions that keep performance high and risk low.

VTEGI integrates video, voice, chat, conferencing, and data in a single, fully redundant architecture, and provides information security consultants to keep your network and assets protected. Our goal is continuous service for your customers with minimal downtime.`,
    offerings: labels(
      'Security & vulnerability assessments',
      'Network admission control (NAC)',
      'Firewalls (server, appliance, router-based)',
      'Remote access & site-to-site VPN',
      'Routing & switching',
      'Campus LAN/MAN design',
      'Monitoring & optimization',
      'Data center networking',
    ),
    startingContext:
      'Sites, connectivity, access boundaries, risk concerns, and reporting expectations.',
  },
  {
    title: 'Unified Communications',
    slug: 'unified-communications',
    icon: 'phone',
    summary:
      'Voice, VoIP, unified messaging, telepresence, and communications integration, installed, maintained, and supported.',
    description: `VTEGI assists with design, implementation, installation, systems integration, operations, and maintenance of telephony and collaboration systems, including VoIP, voicemail, and unified messaging.

We specialize in Cisco solutions and work with major manufacturers to find the right fit for your needs and budget. Our certified technicians guide you through installation and train your staff on the new system.`,
    offerings: labels(
      'Unified communications solutions',
      'Unified messaging',
      'VoIP',
      'Telepresence',
      'Planning, design & implementation',
      'On-site maintenance agreements',
    ),
    startingContext:
      'Communication workflows, existing platforms, availability requirements, and transition plans.',
  },
  {
    title: 'Geospatial Information Systems',
    slug: 'geospatial',
    icon: 'map',
    summary:
      'GIS and remote-sensing consulting and staffing for government and commercial organizations.',
    description: `VTEGI provides Geospatial Information Systems (GIS) and remote-sensing consulting and staffing for government and commercial organizations.

Our focus is enterprise geospatial platform development and management, including cloud and virtualized services, across commercial, open-source, and custom technologies, supporting real-time analytics for mission-critical decision support and planning.`,
    offerings: labels(
      'Geospatial data discovery & integration',
      'Remote sensing',
      'Geocoding & geolocation',
      'Spatiotemporal modeling & visualization',
      'Web & mobile GIS applications',
      'GIS consulting & staffing',
    ),
    startingContext:
      'The decisions you need to support, data types, platform context, and staffing or consulting needs.',
  },
  {
    title: 'Enterprise Management & Support',
    slug: 'enterprise-support',
    icon: 'wrench',
    summary:
      'IT project management, server and desktop administration, help desk, documentation, training, and IT staffing.',
    description: `VTEGI specializes in both network management and implementation, from requirements definition to a cost-effective solution.

Our certified engineers cover system engineering, installation, administration, maintenance, training, help desk, desktop support, hardware and software purchasing, configuration management, and technical documentation, and we provide IT staffing when you need extra hands.`,
    offerings: labels(
      'IT project management',
      'Enterprise management',
      'Planning, design & implementation',
      'Server administration & virtualization',
      'Desktop management',
      'Help desk & desktop support',
      'Network monitoring',
      'IT services & staffing',
    ),
    startingContext:
      'Internal responsibilities, supported systems and users, project priorities, and the help you need.',
  },
]
