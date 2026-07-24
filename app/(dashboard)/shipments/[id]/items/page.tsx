import { createClient } from '@/lib/supabase/server'
import { ItemsTab } from '../items-tab'

export default async function ItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('shipment_item')
    .select('*')
    .eq('shipment_id', id)
    .order('item_no', { ascending: true })

  return <ItemsTab shipmentId={id} initialItems={items ?? []} />
}
