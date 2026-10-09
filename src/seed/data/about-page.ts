const labels = (...items: string[]) => items.map((label) => ({ label }))

export const aboutPage = {
  hero: {
    headline: 'Technology with purpose. People at the center.',
    intro:
      'VTEGI designs, engineers, implements and develops customized solutions with a strategic focus on maximizing our clients’ return on investment, serving the Department of Defense and civilian markets for more than 25 years.',
  },
  mission:
    'To make our technology solutions integrate seamlessly with our clients’ business plans. We help maximize ROI and maintain a competitive, cost-effective advantage for our clients’ growing needs through intelligent solutions.',
  vision:
    'To continually strive as a leading, recognized provider of current, high-quality information technology services for the Department of Defense, government agencies, industry and educational institutions.',
  values: [
    {
      title: 'Integrity',
      text: 'We are forthright, honest and open in all our dealings, inside and outside the company, and work hard to build trust and transparency with our clients.',
    },
    {
      title: 'Accountability',
      text: 'We take ownership of what we do and correct any shortfalls. Our success depends on the timely, effective contribution of every team member.',
    },
    {
      title: 'Education',
      text: 'Every team member makes continuing education, formal or informal, a priority, so we stay current in the latest technologies.',
    },
    {
      title: 'Community',
      text: 'Our community contributes greatly to our success, and we make it a priority to contribute back.',
    },
  ],
  highlights: labels(
    'Top Secret, Secret and DOJ MBI cleared personnel',
    'Cisco CCIE certified personnel',
    'Certified project and program managers',
    'ISO 9001:2015 certified',
    'HUBZone certified business',
    'Veteran-Owned Small Business',
    'MBE certified in Virginia and North Carolina',
    'SWaM certified in Virginia',
  ),
  teamCertifications: labels(
    'VMware Certified Professional',
    'Microsoft Certified Systems Engineer',
    'Microsoft Certified IT Professional',
    'DoD Directive 8570 compliant',
    'Cisco Data Center Unified Computing Support Specialist',
    'Cisco Data Center Networking Infrastructure Support Specialist',
    'Cisco Data Center Storage Networking Support Specialist',
    'Cisco CCNA Data Center',
    'Certified Scrum Masters',
    'ITIL v3',
    'CompTIA Project+',
    'CompTIA Security+',
    'CompTIA Network+',
    'CompTIA A+',
  ),
}
