import { createClient } from '@/lib/supabase/server'
import { ShipmentBreadcrumb, ShipmentNotFound } from './breadcrumb'
import { ShipmentSidebar } from './tabs'
import { ResizableCustomHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default async function ShipmentLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
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
          <ShipmentSidebar shipmentId={id} docNumber={shipment.doc_number} />
        </ResizablePanel>
        <ResizableCustomHandle />
        <ResizablePanel defaultSize='85%' className='flex'>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
