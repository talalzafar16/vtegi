type Category = 'distributor' | 'hardware' | 'software' | 'security' | 'cloud'
type SeedPartner = { name: string; logo: string; website: string; featured?: boolean }

const group = (category: Category, partners: SeedPartner[]) =>
  partners.map((p) => ({ ...p, category }))

export const partners = [
  ...group('distributor', [
    {
      name: 'Ingram Micro',
      logo: 'ingram.png',
      website: 'https://www.ingrammicro.com',
      featured: true,
    },
    { name: 'Tech Data', logo: 'techdata.png', website: 'https://www.tdsynnex.com' },
    {
      name: 'Carahsoft',
      logo: 'carahsoft.png',
      website: 'https://www.carahsoft.com',
      featured: true,
    },
    { name: 'immixGroup', logo: 'immix.png', website: 'https://www.immixgroup.com' },
    {
      name: 'Lifeboat Distribution',
      logo: 'lifeboat.png',
      website: 'https://www.lifeboatdistribution.com',
    },
    { name: 'SYNNEX', logo: 'synnex.png', website: 'https://www.tdsynnex.com' },
    {
      name: 'ComponentSource',
      logo: 'componentsource.png',
      website: 'https://www.componentsource.com',
    },
    { name: 'Vertiv', logo: 'vertiv.png', website: 'https://www.vertiv.com' },
  ]),
  ...group('hardware', [
    {
      name: 'Dell Technologies',
      logo: 'dell.png',
      website: 'https://www.dell.com',
      featured: true,
    },
    { name: 'Lenovo', logo: 'lenovo.png', website: 'https://www.lenovo.com', featured: true },
    { name: 'IBM', logo: 'ibm.png', website: 'https://www.ibm.com', featured: true },
    {
      name: 'APC by Schneider Electric',
      logo: 'apc.png',
      website: 'https://www.apc.com',
      featured: true,
    },
    { name: 'Nutanix', logo: 'nutanix.png', website: 'https://www.nutanix.com', featured: true },
    { name: 'Samsung', logo: 'samsung.png', website: 'https://www.samsung.com/us/business' },
    { name: 'Unitrends', logo: 'unitrends.png', website: 'https://www.unitrends.com' },
    { name: 'Polycom', logo: 'polycom.png', website: 'https://www.hp.com/us-en/poly.html' },
    { name: 'Thinkmate', logo: 'thinkmate.png', website: 'https://www.thinkmate.com' },
    { name: 'Eaton', logo: 'eaton.png', website: 'https://www.eaton.com' },
    { name: 'Emerson', logo: 'emerson.png', website: 'https://www.emerson.com' },
    { name: 'Tripp Lite', logo: 'tripplite.png', website: 'https://www.tripplite.com' },
    {
      name: 'PartnerAxis',
      logo: 'partneraxis.png',
      website: 'https://www.axiomupgrades.com/partneraxis',
    },
    { name: 'Anixter', logo: 'anixter.png', website: 'https://www.anixter.com' },
    { name: 'Fujitsu', logo: 'fujitsu.png', website: 'https://www.fujitsu.com' },
    { name: 'JAR Systems', logo: 'jarsystems.png', website: 'https://www.jar-systems.com' },
    { name: 'BlackBerry', logo: 'blackberry.png', website: 'https://www.blackberry.com' },
    { name: 'Xerox', logo: 'xerox.png', website: 'https://www.xerox.com' },
    { name: 'Douglas Stewart EDU', logo: 'dsedu.png', website: 'https://www.dstewart.com' },
  ]),
  ...group('software', [
    {
      name: 'Microsoft',
      logo: 'microsoft.png',
      website: 'https://www.microsoft.com',
      featured: true,
    },
    { name: 'VMware', logo: 'vmware.png', website: 'https://www.vmware.com', featured: true },
    { name: 'Red Hat', logo: 'redhat.png', website: 'https://www.redhat.com', featured: true },
    { name: 'Veeam', logo: 'veeampro.png', website: 'https://www.veeam.com', featured: true },
    { name: 'Oracle', logo: 'oracle.png', website: 'https://www.oracle.com', featured: true },
    { name: 'SAP', logo: 'sap.png', website: 'https://www.sap.com', featured: true },
    {
      name: 'Microsoft Education (AEP)',
      logo: 'microsoft-aep.png',
      website: 'https://www.microsoft.com/education',
    },
    { name: 'Google for Education', logo: 'google-edu.png', website: 'https://edu.google.com' },
    { name: 'Citrix', logo: 'citrix.png', website: 'https://www.citrix.com' },
    { name: 'DataCore', logo: 'datacore.png', website: 'https://www.datacore.com' },
    { name: 'Micro Focus', logo: 'microfocus.png', website: 'https://www.opentext.com' },
    { name: 'Adobe', logo: 'adobe.png', website: 'https://www.adobe.com' },
    { name: 'erwin', logo: 'erwin.png', website: 'https://www.erwin.com' },
    { name: 'Quest Software', logo: 'quest.png', website: 'https://www.quest.com' },
    { name: 'Atlassian', logo: 'atlassian.png', website: 'https://www.atlassian.com' },
  ]),
  ...group('security', [
    { name: 'Splunk', logo: 'splunk.png', website: 'https://www.splunk.com', featured: true },
    {
      name: 'Symantec',
      logo: 'symantec.png',
      website: 'https://www.broadcom.com/products/cybersecurity',
    },
    { name: 'McAfee', logo: 'mcafee.png', website: 'https://www.mcafee.com' },
    { name: 'SolarWinds', logo: 'solarwinds.png', website: 'https://www.solarwinds.com' },
    { name: 'Veritas', logo: 'veritas.png', website: 'https://www.veritas.com' },
    { name: 'RSA', logo: 'rsa.png', website: 'https://www.rsa.com' },
  ]),
  ...group('cloud', [
    { name: 'AWS', logo: 'aws.png', website: 'https://aws.amazon.com', featured: true },
    { name: 'Pax8', logo: 'pax8.png', website: 'https://www.pax8.com' },
    { name: 'Cloudera', logo: 'cloudera.png', website: 'https://www.cloudera.com' },
  ]),
]
