'use client'

import { useRouter } from 'next/navigation'
import { LayoutGrid, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewShipmentSheet from '@/components/new-shipment-sheet'
import { useLang } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/date'

type Shipment = {
  id: string
  doc_number: string
  status: string | null
  created_at: string
  shipment_date: string | null
  port_of_loading: string | null
  port_of_destination: string | null
  customer: { company_name: string } | null
}

export default function ShipmentTable({
  shipments,
  total,
  from,
  to,
}: {
  shipments: Shipment[]
  total: number
  from: number
  to: number
}) {
  const router = useRouter()
  const { t } = useLang()
  const s = t.shipments

  return (
    <div className='h-full flex flex-col'>

      {/* Toolbar */}
      <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <LayoutGrid className='size-3.5' />
          {t.nav.explorer}
          <ChevronRight className='size-3' />
          <span className='text-foreground font-medium'>{s.allShipments}</span>
        </div>
        <div className='ml-auto'>
          <NewShipmentSheet />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col overflow-auto p-4 gap-3'>

        {/* Count + Filter row */}
        <div className='flex items-center justify-between'>
          <p className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
            {s.allShipments} — {total} records
          </p>
          <Button variant='outline' size='sm' className='h-7 text-xs gap-1.5'>
            <Filter className='size-3' />
            {s.filter}
          </Button>
        </div>

        {/* Table */}
        <div className='flex-1'>
          <table className='min-w-max text-sm border-collapse w-full'>
            <thead>
              <tr className='border-b'>
                {[s.docNumber, s.customer, s.status, s.portOfLoading, s.portOfDestination, s.shipmentDate, s.createdAt].map(h => (
                  <th key={h} className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipments.length === 0
                ? <tr><td colSpan={7} className='px-2 py-8 text-center text-xs text-muted-foreground'>{s.notFound}</td></tr>
                : shipments.map(row => (
                  <tr
                    key={row.id}
                    className='border-b hover:bg-muted/40 hover:cursor-pointer align-middle'
                    onClick={() => router.push(`/shipments/${row.id}`)}
                  >
                    <td className='px-2 py-2 font-medium font-mono'>{row.doc_number}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.customer?.company_name ?? '—'}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.status ?? '—'}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.port_of_loading ?? '—'}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.port_of_destination ?? '—'}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.shipment_date ? formatDate(row.shipment_date) : '—'}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{formatDate(row.created_at)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
