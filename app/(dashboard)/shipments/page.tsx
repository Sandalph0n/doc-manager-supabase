import { createClient } from '@/lib/supabase/server';
import ShipmentTable from './ShipmentTable';

export default async function ShipmentsPage({
  searchParams,
} : {
  searchParams: Promise<{f?: string | string[], from?: string, to?: string}>
}) {
  const { from: fromParam, to: toParam } = await searchParams;
  const supabase = await createClient();

  const fromRecord = Math.max(1, parseInt(fromParam ?? '1') || 1)
  const toRecord   = Math.max(fromRecord, parseInt(toParam ?? String(fromRecord + 19)) || fromRecord + 19)

  // SELECT shipment.*, customer.company_name
  // FROM shipment
  // LEFT JOIN customer ON customer.id = shipment.customer_id
  // ORDER BY shipment.created_at DESC
  // LIMIT (toRecord - fromRecord + 1) OFFSET (fromRecord - 1)
  const { data: shipments, count } = await supabase
    .from('shipment')
    .select('*, customer(company_name)', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(fromRecord - 1, toRecord - 1)

  return (
    <ShipmentTable
      shipments={shipments ?? []}
      total={count ?? 0}
      from={fromRecord}
      to={Math.min(toRecord, count ?? 0)}
    />
  )
}
