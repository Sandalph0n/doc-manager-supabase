'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Info, Package, Files } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import { InfoTab } from './info-tab'
import type { Shipment } from '@/schemas/shipment'
import { ItemsTab } from './items-tab'
import { DocumentsTab } from './documents-tab'

export function ShipmentSidebar() {
  const { t } = useLang()
  const s = t.shipments
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'info'

  const tabs = [
    { id: 'info',      label: s.tabInfo,      icon: Info    },
    { id: 'items',     label: s.tabItems,     icon: Package },
    { id: 'documents', label: s.tabDocuments, icon: Files   },
  ]

  function setTab(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', id)
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex flex-col h-full bg-background py-2 px-2 gap-0.5'>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={cn(
            'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors w-full text-left',
            activeTab === id
              ? 'bg-accent/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Icon className='size-3.5 shrink-0' />
          {label}
        </button>
      ))}
      <div className='flex-1' />
      {/* future buttons go here */}
    </div>
  )
}

export function ShipmentContent({ shipment }: { shipment: Shipment }) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'info'

  return (
    <div className='flex-1 overflow-auto p-4 flex flex-col'>
      {activeTab === 'info'      && <InfoTab shipment={shipment} />}
      {activeTab === 'items'     && <ItemsTab />}
      {activeTab === 'documents' && <DocumentsTab />}
    </div>
  )
}
