import { createClient } from '@/lib/supabase/server'
import { InfoTab } from '../info-tab'

export default async function InfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: shipment } = await supabase
    .from('shipment')
    .select('*')
    .eq('id', id)
    .single()

  if (!shipment) return null

  return (
    <div className='flex-1 overflow-auto p-4 flex flex-col'>
      <InfoTab shipment={shipment} />
    </div>
  )
}
