/** PocketBase dates look like '2026-11-06 22:00:00.000Z'; '' when unset. */
export function parseDate(value: string): Date | null {
  if (!value) return null
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? null : date
}

const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'short' })
const dayFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric' })
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const fullFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatRange(fmt: Intl.DateTimeFormat, startValue: string, endValue: string): string {
  const start = parseDate(startValue)
  if (!start) return ''
  const end = parseDate(endValue)
  return end && end > start ? fmt.formatRange(start, end) : fmt.format(start)
}

/** Calendar-tile pieces for the start date, or null when the event has no date. */
export function dateParts(startValue: string) {
  const start = parseDate(startValue)
  if (!start) return null
  return {
    weekday: weekdayFmt.format(start),
    month: monthFmt.format(start),
    day: dayFmt.format(start),
  }
}

/** e.g. '5:00 – 8:00 PM'. */
export function formatTimeRange(start: string, end: string): string {
  return formatRange(timeFmt, start, end)
}

/** Start time alone, e.g. '5:00 PM'; '' when the event has no date. */
export function formatStartTime(start: string): string {
  const date = parseDate(start)
  return date ? timeFmt.format(date) : ''
}

/** e.g. 'Friday, November 6, 5:00 – 8:00 PM'. */
export function formatWhen(start: string, end: string): string {
  return formatRange(fullFmt, start, end)
}

/** Editor HTML to plain-text paragraphs, so untrusted markup is never rendered. */
export function descriptionParagraphs(html: string): string[] {
  if (!html) return []
  const body = new DOMParser().parseFromString(html, 'text/html').body
  const blocks = body.children.length
    ? Array.from(body.children, (el) => el.textContent ?? '')
    : [body.textContent ?? '']
  return blocks.map((text) => text.trim()).filter(Boolean)
}
