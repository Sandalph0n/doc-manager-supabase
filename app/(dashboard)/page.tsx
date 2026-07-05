import { LayoutGrid, ChevronRight } from 'lucide-react'
import NewShipmentSheet from '@/components/new-shipment-sheet'

export default function ExplorerPage() {
  return (
    <>
      {/* Toolbar */}
      <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <LayoutGrid className='size-3.5' />
          Explorer
          <ChevronRight className='size-3' />
          <span className='text-foreground font-medium'>All shipments</span>
        </div>
        <div className='ml-auto'>
          <NewShipmentSheet />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto p-4'>
      </div>
    </>
  )
}
