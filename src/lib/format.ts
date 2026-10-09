const timeZone = 'America/New_York' // VTEGI's home time zone

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone })

// dateStyle/timeStyle can't be combined with timeZoneName, so spell the fields out.
const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone,
  timeZoneName: 'short',
})

/** "October 9, 2026". */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

/** "October 9, 2026 at 2:00 PM EDT". */
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso))
