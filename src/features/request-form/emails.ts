import {
  computerTypes,
  contactMethods,
  HELP_ME_CHOOSE,
  inquiryTypes,
  organizationTypes,
  timelines,
} from './options'
import { emailButton, emailLayout, emailRows, emailText, escapeHtml } from '@/lib/email'
import { labelOf } from '@/lib/utils'

import type { RequestInput } from './schema'

function summaryRows(data: RequestInput, solutionTitle?: string) {
  const solution = data.solution === HELP_ME_CHOOSE ? 'Help me choose' : solutionTitle
  const rows: [string, string | undefined][] = [
    ['Inquiry', labelOf(inquiryTypes, data.inquiryType)],
    ['Solution', solution],
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Organization', data.organization],
    ['Organization type', labelOf(organizationTypes, data.organizationType)],
    ['Timeline', labelOf(timelines, data.timeline)],
    ['Preferred contact', labelOf(contactMethods, data.contactMethod)],
    ['Computer type', labelOf(computerTypes, data.computerType)],
    ['Budget', data.budget],
    ['Applications', data.applications],
    ['Message', data.message],
  ]
  return emailRows(rows)
}

/** Internal alert to the VTEGI team. */
export function newLeadEmail(
  data: RequestInput,
  solutionTitle: string | undefined,
  adminUrl: string,
) {
  const inquiry = labelOf(inquiryTypes, data.inquiryType)
  return {
    subject: `New website request: ${inquiry} from ${data.name}`,
    html: emailLayout(
      'New website request',
      summaryRows(data, solutionTitle) + emailButton(adminUrl, 'Open in admin'),
    ),
  }
}

/** Confirmation sent to the person who submitted the form. */
export function confirmationEmail(data: RequestInput, solutionTitle: string | undefined) {
  return {
    subject: 'We received your request | VTEGI',
    html: emailLayout(
      `Thanks, ${escapeHtml(data.name)}. We received your request.`,
      emailText(
        'A VTEGI specialist will review your request and follow up within one business day to discuss next steps.',
      ) +
        `<p style="margin:0 0 8px;color:#71717a">Here is a copy of what you sent:</p>` +
        summaryRows(data, solutionTitle),
    ),
  }
}
