import { Temporal } from '@js-temporal/polyfill'

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  // Date-only string from Postgres `date` column (e.g. "2026-01-11") — no timezone offset
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    return Temporal.PlainDate.from(isoString).toLocaleString()
  }
  // Full ISO with offset (e.g. timestamptz)
  return Temporal.Instant.from(isoString)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate()
    .toLocaleString()
}
