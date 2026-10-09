import {
  computerTypes,
  contactMethods,
  HELP_ME_CHOOSE,
  inquiryTypes,
  organizationTypes,
  timelines,
} from './options'
import { labelOf } from '@/lib/utils'

import type { RequestInput } from './schema'

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

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
  return rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;vertical-align:top;white-space:nowrap">${label}</td>` +
        `<td style="padding:6px 0;color:#18181b">${escapeHtml(value!).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')
}

const layout = (heading: string, body: string) => `<!doctype html>
<html><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
<div style="background:#ffffff;border-radius:12px;border-top:4px solid #cc0505;padding:32px">
<h1 style="margin:0 0 16px;font-size:20px;color:#18181b">${heading}</h1>${body}
</div>
<p style="margin:16px 0 0;color:#a1a1aa;font-size:12px">Virtual Technology Enterprise Group Inc. (VTEGI)</p>
</div></body></html>`

/** Internal alert to the VTEGI team. */
export function newLeadEmail(
  data: RequestInput,
  solutionTitle: string | undefined,
  adminUrl: string,
) {
  const inquiry = labelOf(inquiryTypes, data.inquiryType)
  return {
    subject: `New website request: ${inquiry} from ${data.name}`,
    html: layout(
      'New website request',
      `<table style="border-collapse:collapse">${summaryRows(data, solutionTitle)}</table>
<p style="margin:24px 0 0"><a href="${adminUrl}" style="background:#cc0505;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold">Open in admin</a></p>`,
    ),
  }
}

/** Confirmation sent to the person who submitted the form. */
export function confirmationEmail(data: RequestInput, solutionTitle: string | undefined) {
  return {
    subject: 'We received your request | VTEGI',
    html: layout(
      `Thanks, ${escapeHtml(data.name)}. We received your request.`,
      `<p style="margin:0 0 16px;color:#3f3f46">A VTEGI specialist will review your request and follow up within one business day to discuss next steps.</p>
<p style="margin:0 0 8px;color:#71717a">Here is a copy of what you sent:</p>
<table style="border-collapse:collapse">${summaryRows(data, solutionTitle)}</table>`,
    ),
  }
}
