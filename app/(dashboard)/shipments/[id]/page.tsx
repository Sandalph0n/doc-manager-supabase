import { createClient } from '@/lib/supabase/server'
import { ShipmentBreadcrumb, ShipmentNotFound } from './breadcrumb'
import { ShipmentSidebar, ShipmentContent } from './tabs'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default async function ShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: shipment } = await supabase
    .from('shipment')
    .select('*')
    .eq('id', id)
    .single()

  if (!shipment) return <ShipmentNotFound id={id} />

  return (
    <div className='w-full h-full flex-1 flex flex-col'>
      <ShipmentBreadcrumb docNumber={shipment.doc_number} docId={shipment.id} />
      <ResizablePanelGroup orientation='horizontal' className='flex-1 overflow-hidden'>
        <ResizablePanel defaultSize='15%' minSize='10%' maxSize='30%'>
          <ShipmentSidebar />
        </ResizablePanel>
        <ResizableCustomHandle />
        <ResizablePanel defaultSize='85%'>
          <ShipmentContent shipment={shipment} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
