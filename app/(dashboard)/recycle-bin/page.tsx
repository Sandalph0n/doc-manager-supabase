import { createClient } from '@/lib/supabase/server'
import RecycleBinTable from './RecycleBinTable'

export default async function RecycleBinPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from: fromParam, to: toParam } = await searchParams
  const supabase = await createClient()

  const fromRecord = Math.max(1, parseInt(fromParam ?? '1') || 1)
  const toRecord   = Math.max(fromRecord, parseInt(toParam ?? String(fromRecord + 19)) || fromRecord + 19)

  const { data: shipments, count } = await supabase
    .from('shipment')
    .select('*, customer(company_name)', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(fromRecord - 1, toRecord - 1)

  return (
    <RecycleBinTable
      shipments={shipments ?? []}
      total={count ?? 0}
      from={fromRecord}
      to={Math.min(toRecord, count ?? 0)}
    />
  )
}
