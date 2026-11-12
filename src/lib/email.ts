// Building blocks for the website's HTML emails (inline styles: email clients ignore stylesheets).

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

/** Label/value rows; empty values are left out. Values are escaped. */
export function emailRows(rows: [label: string, value: string | null | undefined][]) {
  const body = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;vertical-align:top;white-space:nowrap">${label}</td>` +
        `<td style="padding:6px 0;color:#18181b">${escapeHtml(value!).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')
  return `<table style="border-collapse:collapse">${body}</table>`
}

export const emailButton = (href: string, label: string) =>
  `<p style="margin:24px 0 0"><a href="${href}" style="background:#cc0505;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold">${label}</a></p>`

export const emailText = (html: string) => `<p style="margin:0 0 16px;color:#3f3f46">${html}</p>`

/** Branded wrapper. `heading` is HTML: escape any user input in it. */
export const emailLayout = (heading: string, body: string) => `<!doctype html>
<html><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
<div style="background:#ffffff;border-radius:12px;border-top:4px solid #cc0505;padding:32px">
<h1 style="margin:0 0 16px;font-size:20px;color:#18181b">${heading}</h1>${body}
</div>
<p style="margin:16px 0 0;color:#a1a1aa;font-size:12px">Virtual Technology Enterprise Group Inc. (VTEGI)</p>
</div></body></html>`
