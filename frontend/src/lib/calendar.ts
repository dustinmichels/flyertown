import { parseDate } from './format'
import type { EventRecord } from './pocketbase'

export interface CalendarDay {
  /** Local date as 'YYYY-MM-DD'. */
  key: string
  date: Date
  /** False for the leading/trailing days that pad out the first and last week. */
  inMonth: boolean
  isToday: boolean
  events: EventRecord[]
}

const DAY_MS = 86_400_000

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(month: Date, count: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + count, 1)
}

/**
 * Events under every local day they touch, so multi-day events show on each of their days.
 * Ends are exclusive: an event ending at midnight doesn't spill onto the next day.
 */
export function eventsByDay(events: EventRecord[]): Map<string, EventRecord[]> {
  const byDay = new Map<string, EventRecord[]>()
  for (const event of events) {
    const start = parseDate(event.start_datetime)
    if (!start) continue
    const end = parseDate(event.end_datetime)
    const last = startOfDay(end && end > start ? new Date(end.getTime() - 1) : start)
    for (let day = startOfDay(start); day <= last; day = addDays(day, 1)) {
      const key = dayKey(day)
      const list = byDay.get(key)
      if (list) list.push(event)
      else byDay.set(key, [event])
    }
  }
  return byDay
}

/** Sunday-first weeks covering `month`, padded with neighbouring days to whole weeks. */
export function monthDays(
  month: Date,
  byDay: Map<string, EventRecord[]>,
  today: Date
): CalendarDay[] {
  const first = startOfMonth(month)
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  const gridStart = addDays(first, -first.getDay())
  const gridEnd = addDays(last, 6 - last.getDay())
  const count = Math.round((gridEnd.getTime() - gridStart.getTime()) / DAY_MS) + 1
  const todayKey = dayKey(today)

  return Array.from({ length: count }, (_, i) => {
    const date = addDays(gridStart, i)
    const key = dayKey(date)
    return {
      key,
      date,
      inMonth: date.getMonth() === first.getMonth(),
      isToday: key === todayKey,
      events: byDay.get(key) ?? [],
    }
  })
}

/** Month of the next upcoming event, else the latest event, else the current month. */
export function initialMonth(events: EventRecord[], today: Date): Date {
  const midnight = startOfDay(today)
  const dates = events.map((event) => parseDate(event.start_datetime)).filter((d) => d !== null)
  const upcoming = dates.filter((d) => d >= midnight).sort((a, b) => a.getTime() - b.getTime())[0]
  const latest = dates.sort((a, b) => b.getTime() - a.getTime())[0]
  return startOfMonth(upcoming ?? latest ?? today)
}

/** e.g. 'November 2026'. */
export const monthLabelFmt = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
/** e.g. 'Friday, November 6'. */
export const fullDateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

/** Short weekday names, Sunday first. 2026-01-04 is a Sunday. */
export const weekdayNames = Array.from({ length: 7 }, (_, i) =>
  weekdayFmt.format(new Date(2026, 0, 4 + i))
)
