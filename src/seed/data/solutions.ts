import type { RequiredDataFromCollectionSlug } from 'payload'

const sharedCapabilityFaq = {
  question: 'Do I need a detailed technical specification to get started?',
  answer:
    'No. A short description of your goals, current challenge and timeline is enough. A VTEGI specialist will help define scope from there.',
}

export const solutions: RequiredDataFromCollectionSlug<'solutions'>[] = [
  {
    title: 'Government Solutions',
    slug: 'government',
    icon: 'landmark',
    shortDescription: 'Secure, compliant IT services for federal, state, and local agencies.',
    ctaLabel: 'Request Government Support',
    audiences: [
      { label: 'Federal agencies' },
      { label: 'State government' },
      { label: 'Local government' },
    ],
    hero: {
      headline: 'Built around your public mission.',
      intro:
        'Plan, modernize, and support technology around agency priorities. Start with your requirements, operating environment, and the mission you need to advance.',
    },
    capabilities: [
      {
        title: 'Infrastructure modernization',
        description:
          'Architecture, server environments, network design, and a staged path from the current state to the desired state.',
      },
      {
        title: 'Security & assurance',
        description:
          'Vulnerability and risk assessments, risk mitigation, and the documentation your engagement requires.',
      },
      {
        title: 'Systems integration',
        description:
          'Dependencies, integration requirements, implementation sequencing, and a clean technical handoff.',
      },
      {
        title: 'Operational documentation',
        description:
          'Configuration records, operating procedures, recovery documentation, and clear support ownership.',
      },
    ],
    scenarios: [
      {
        title: 'Modernization planning',
        description:
          'An agency needs a clearer view of its infrastructure and dependencies before a planned upgrade.',
      },
      {
        title: 'Operational readiness',
        description:
          'An IT team wants to define support responsibilities and documentation before transitioning a system.',
      },
    ],
    faqs: [
      {
        question: 'Can a government organization request managed IT support?',
        answer:
          'Yes. Choose Managed IT Services as the solution and Government as your organization type in the request form.',
      },
      {
        question: 'What should I avoid including in a request?',
        answer:
          'Do not include credentials, controlled or classified information, or sensitive technical details. A high-level summary is all we need to start.',
      },
    ],
  },
  {
    title: 'Commercial Solutions',
    slug: 'commercial',
    icon: 'building',
    shortDescription: 'Scalable technology that helps businesses grow and run efficiently.',
    ctaLabel: 'Request Business Support',
    audiences: [
      { label: 'Growing businesses' },
      { label: 'Established enterprises' },
      { label: 'Multi-site organizations' },
    ],
    hero: {
      headline: 'Technology that supports your next stage.',
      intro:
        'Connect technology decisions with business priorities: productivity, infrastructure, security, and the systems your people use every day.',
    },
    capabilities: [
      {
        title: 'Technology planning',
        description:
          'Turn business goals, current challenges, and budget into a prioritized technology roadmap.',
      },
      {
        title: 'Infrastructure & cloud',
        description: 'Infrastructure design, migration, connectivity, and workload planning.',
      },
      {
        title: 'Productivity & collaboration',
        description: 'The tools, access, and integrations that support everyday work.',
      },
      {
        title: 'Security & continuity',
        description:
          'Identity and device protection, backup, and recovery planning built around your operations.',
      },
    ],
    scenarios: [
      {
        title: 'A growing organization',
        description:
          'A business adding staff or locations needs to revisit infrastructure, access, and support.',
      },
      {
        title: 'A connected workplace',
        description:
          'Teams want to reduce fragmentation between communication tools and operational systems.',
      },
    ],
    faqs: [
      sharedCapabilityFaq,
      {
        question: 'Can I combine a project with ongoing support?',
        answer:
          'Yes. Describe both needs in your request. Managed IT Services can cover day-to-day support after a project is delivered.',
      },
    ],
  },
  {
    title: 'Education Solutions',
    slug: 'education',
    icon: 'graduation-cap',
    shortDescription: 'Reliable tools and infrastructure for schools, colleges, and universities.',
    ctaLabel: 'Request Education Support',
    audiences: [{ label: 'K–12 schools' }, { label: 'Colleges' }, { label: 'Universities' }],
    hero: {
      headline: 'A stronger foundation for learning.',
      intro:
        'Technology that supports teaching, administration, and the spaces where learning happens, planned around your institution and academic calendar.',
    },
    capabilities: [
      {
        title: 'Campus connectivity',
        description: 'Network infrastructure, wireless coverage, segmentation, and availability.',
      },
      {
        title: 'Devices & lifecycle',
        description: 'Endpoint deployment, management, replacement planning, and support.',
      },
      {
        title: 'Collaboration & administration',
        description:
          'Tools and infrastructure for institutional communication and administrative work.',
      },
      {
        title: 'Identity & recovery',
        description:
          'Access roles, information protection, backup, and continuity of essential systems.',
      },
    ],
    scenarios: [
      {
        title: 'A planned technology refresh',
        description:
          'An institution coordinates device and infrastructure changes with its academic calendar.',
      },
      {
        title: 'A shared campus environment',
        description:
          'IT staff need clear access, connectivity, and support across students, faculty, and staff.',
      },
    ],
    faqs: [
      sharedCapabilityFaq,
      {
        question: 'Can an institution ask about ongoing support?',
        answer:
          'Yes. Choose Education as your organization type and Managed IT Services as the solution in the request form.',
      },
    ],
  },
  {
    title: 'Healthcare Solutions',
    slug: 'healthcare',
    icon: 'heart-pulse',
    shortDescription:
      'HIPAA-conscious technology that supports providers and protects patient data.',
    ctaLabel: 'Request Healthcare Support',
    audiences: [
      { label: 'Provider organizations' },
      { label: 'Medical practices' },
      { label: 'Healthcare support teams' },
    ],
    hero: {
      headline: 'Reliable technology. More focus on care.',
      intro:
        'Technology planned around provider operations, dependable infrastructure, and careful handling of sensitive information.',
    },
    capabilities: [
      {
        title: 'Infrastructure reliability',
        description:
          'Server, network, endpoint, and connectivity needs that support healthcare operations.',
      },
      {
        title: 'Access & device management',
        description: 'Identities, permissions, and endpoint controls across your care teams.',
      },
      {
        title: 'Backup & continuity',
        description: 'Backup, recovery, and operational continuity for the systems you depend on.',
      },
      {
        title: 'Support coordination',
        description: 'Clear technical ownership, escalation paths, and service expectations.',
      },
    ],
    scenarios: [
      {
        title: 'A practice infrastructure review',
        description:
          'An organization wants to understand operational dependencies before a planned technology change.',
      },
      {
        title: 'Clearer access and support',
        description:
          'A provider team needs to clarify device management, access responsibilities, and escalation.',
      },
    ],
    faqs: [
      {
        question: 'Can I include patient information in my request?',
        answer:
          'No. Please never submit protected health information (PHI). A high-level description of your need is all we need.',
      },
      sharedCapabilityFaq,
    ],
  },
  {
    title: 'Managed IT Services',
    slug: 'managed-it',
    icon: 'headset',
    shortDescription:
      'Proactive monitoring, help desk, and IT management so you can focus on your work.',
    ctaLabel: 'Request Managed Services',
    audiences: [
      { label: 'Government & public organizations' },
      { label: 'Businesses' },
      { label: 'Education & healthcare' },
    ],
    hero: {
      headline: 'Keep your people moving. Keep IT in focus.',
      intro:
        'Proactive monitoring, user support, and day-to-day technology management with clear responsibilities and an agreed service scope.',
    },
    capabilities: [
      {
        title: 'Monitoring & visibility',
        description: 'Infrastructure and network monitoring, alert handling, and issue review.',
      },
      {
        title: 'Help desk & user support',
        description:
          'Desktop support and help desk with clear contact methods and escalation paths.',
      },
      {
        title: 'Endpoint & maintenance',
        description: 'Device management, approved changes, maintenance windows, and patching.',
      },
      {
        title: 'Backup & reporting',
        description:
          'Data backup, disaster recovery planning, documentation, and service reporting.',
      },
    ],
    scenarios: [
      {
        title: 'Support for a lean IT team',
        description:
          'An organization needs help defining and managing routine support responsibilities.',
      },
      {
        title: 'Consistency across locations',
        description:
          'A distributed environment needs a common approach to device management and escalation.',
      },
    ],
    faqs: [
      {
        question: 'Can this complement our internal IT team?',
        answer:
          'Yes. We agree the division of responsibilities and access permissions with your team before service begins.',
      },
      {
        question: 'Is this form an emergency support channel?',
        answer:
          'No. The request form is for new services. Existing clients should use their agreed support contact.',
      },
    ],
  },
]
