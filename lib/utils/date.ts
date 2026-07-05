import { Temporal } from '@js-temporal/polyfill'

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  return Temporal.Instant.from(isoString)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate()
    .toLocaleString()
}
