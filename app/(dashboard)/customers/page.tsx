import { createClient } from '@/lib/supabase/server'
import CustomerTable from './customer-table'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; q?: string }>
}) {
  const { from: fromParam, to: toParam, q } = await searchParams
  const supabase = await createClient()

  // ── Fuzzy search ────────────────────────────────────────────────────────────
  if (q?.trim()) {
    const fromRecord = Math.max(1, parseInt(fromParam ?? '1') || 1)
    const toRecord = Math.max(fromRecord, parseInt(toParam ?? String(fromRecord + 19)) || fromRecord + 19)

    const { data } = await supabase.rpc('search_customers', {
      q: q.trim(),
      p_from: fromRecord,
      p_to: toRecord,
    })
    const rows = data ?? []
    const total = Number(rows[0]?.total ?? 0)
    const customers = rows.map(({ total: _, ...rest }: any) => rest) // eslint-disable-line

    return (
      <CustomerTable
        customers={customers}
        total={total}
        from={fromRecord}
        to={Math.min(toRecord, total)}
        query={q}
      />
    )
  }

  // ── Normal pagination ────────────────────────────────────────────────────────
  const fromRecord = Math.max(1, parseInt(fromParam ?? '1') || 1)
  const toRecord = Math.max(fromRecord, parseInt(toParam ?? String(fromRecord + 19)) || fromRecord + 19)

  const { data: customers, count } = await supabase
    .from('customer')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(fromRecord - 1, toRecord - 1)

  const total = count ?? 0

  return (
    <CustomerTable
      customers={customers ?? []}
      total={total}
      from={fromRecord}
      to={Math.min(toRecord, total)}
    />
  )
}
