'use client'

import Link from 'next/link'
import { LayoutGrid, ChevronRight } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

export function ShipmentBreadcrumb({ docNumber, docId }: { docNumber: string, docId: string }) {
  const { t } = useLang()

  return (
    <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
        <LayoutGrid className='size-3.5' />
        <Link href='/shipments' className='hover:text-foreground transition-colors'>
          {t.nav.explorer}
        </Link>
        <ChevronRight className='size-3' />
        <span className='text-foreground font-medium font-mono'>{docNumber}</span>
        
        <span className='text-muted-foreground font-light font-mono'>[{docId}]</span>

      </div>
    </div>
  )
}

export function ShipmentNotFound({ id }: { id: string }) {
  const { t } = useLang()

  return (
    <div className='flex-1 flex flex-col'>
      <div className='flex items-center h-9 px-4 border-b bg-background shrink-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <LayoutGrid className='size-3.5' />
          <Link href='/shipments' className='hover:text-foreground transition-colors'>
            {t.nav.explorer}
          </Link>
        </div>
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-sm text-muted-foreground'>
          {t.shipments.notFoundDoc} <span className='font-mono'>{id}</span>
        </p>
      </div>
    </div>
  )
}
