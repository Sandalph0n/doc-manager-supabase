'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Info, Package, Files, FileOutput, Trash2, Loader2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useLang } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const BUCKET = 'shipment-documents'

export function ShipmentSidebar({ shipmentId, docNumber }: { shipmentId: string, docNumber: string }) {
  const { t } = useLang()
  const s = t.shipments
  const pathname = usePathname()
  const router   = useRouter()

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [showDelete, setShowDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Duplicate state ───────────────────────────────────────────────────────────
  const [showDuplicate, setShowDuplicate] = useState(false)
  const [newDocNumber, setNewDocNumber]   = useState('')
  const [isDuplicating, setIsDuplicating] = useState(false)

  const tabs = [
    { href: `/shipments/${shipmentId}/info`,      label: s.tabInfo,      icon: Info    },
    { href: `/shipments/${shipmentId}/items`,     label: s.tabItems,     icon: Package },
    { href: `/shipments/${shipmentId}/documents`, label: s.tabDocuments, icon: Files   },
  ]

  const generateHref = `/shipments/${shipmentId}/generate`

  // ── Handlers ──────────────────────────────────────────────────────────────────

  async function handleDelete() {
    setIsDeleting(true)
    const supabase = createClient()

    // TODO: recycle bin — xoá file storage + xoá vĩnh viễn sẽ làm sau
    // const { data: docs } = await supabase
    //   .from('shipment_document')
    //   .select('storage_path')
    //   .eq('shipment_id', shipmentId)
    // const paths = (docs ?? []).map(d => d.storage_path).filter(Boolean) as string[]
    // if (paths.length > 0) {
    //   const { error: storageErr } = await supabase.storage.from(BUCKET).remove(paths)
    //   if (storageErr) toast.warning(`Storage: ${storageErr.message} — tiếp tục xoá DB.`)
    // }
    // await supabase.from('shipment').delete().eq('id', shipmentId)

    const { error: dbErr } = await supabase
      .from('shipment')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', shipmentId)

    setIsDeleting(false)

    if (dbErr) { toast.error(dbErr.message); setShowDelete(false); return }
    toast.success(s.deleteSuccess)
    router.push('/shipments')
  }

  async function handleDuplicate() {
    const name = newDocNumber.trim()
    if (!name) { toast.error(s.duplicateNewDocRequired); return }

    setIsDuplicating(true)
    const supabase = createClient()

    const { data: newId, error } = await supabase.rpc('duplicate_shipment', {
      p_source_id:  shipmentId,
      p_doc_number: name,
    })

    setIsDuplicating(false)

    if (error) { toast.error(error.message); return }

    toast.success(s.duplicateSuccess)
    setShowDuplicate(false)
    router.push(`/shipments/${newId}/info`)
  }

  function openDuplicate() {
    setNewDocNumber(docNumber + s.duplicateSuffix)
    setShowDuplicate(true)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className='flex flex-col h-full bg-background py-2 px-2 gap-0.5'>

      {/* Nav tabs */}
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors w-full',
            pathname === href
              ? 'bg-accent/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Icon className='size-3.5 shrink-0' />
          {label}
        </Link>
      ))}

      <div className='my-2 border-t' />

      <Link
        href={generateHref}
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors w-full',
          pathname === generateHref
            ? 'bg-accent/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        <FileOutput className='size-3.5 shrink-0' />
        {s.generateDocuments}
      </Link>

      <div className='flex-1' />

      {/* Bottom actions */}
      <div className='border-t pt-2 flex flex-col gap-0.5'>
        <button
          onClick={openDuplicate}
          className='flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors w-full text-muted-foreground hover:text-foreground hover:bg-muted'
        >
          <Copy className='size-3.5 shrink-0' />
          {s.duplicateShipment}
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className='flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10'
        >
          <Trash2 className='size-3.5 shrink-0' />
          {s.deleteShipment}
        </button>
      </div>

      {/* ── Delete dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={showDelete} onOpenChange={open => { if (!open && !isDeleting) setShowDelete(false) }}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{s.deleteShipment} <span className='font-mono'>{docNumber}</span>?</DialogTitle>
            <DialogDescription>
              {s.deleteConfirmDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' size='sm' onClick={() => setShowDelete(false)} disabled={isDeleting}>
              {s.cancel}
            </Button>
            <Button variant='destructive' size='sm' onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className='size-3 animate-spin mr-1' />}
              {s.deleteShipment}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Duplicate dialog ──────────────────────────────────────────────────── */}
      <Dialog open={showDuplicate} onOpenChange={open => { if (!open && !isDuplicating) setShowDuplicate(false) }}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{s.duplicateTitle}</DialogTitle>
            <DialogDescription>
              {s.duplicateDesc}{' '}
              <span className='font-mono font-medium text-foreground'>{docNumber}</span>.{' '}
              {s.duplicateDescNote}
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-1.5 py-1'>
            <label className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
              {s.duplicateNewDocNumber}
            </label>
            <input
              autoFocus
              value={newDocNumber}
              onChange={e => setNewDocNumber(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleDuplicate() }}
              placeholder={docNumber + s.duplicateSuffix}
              className='h-8 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring'
            />
          </div>

          <DialogFooter>
            <Button variant='outline' size='sm' onClick={() => setShowDuplicate(false)} disabled={isDuplicating}>
              {s.cancel}
            </Button>
            <Button size='sm' onClick={handleDuplicate} disabled={isDuplicating || !newDocNumber.trim()}>
              {isDuplicating && <Loader2 className='size-3 animate-spin mr-1' />}
              {s.duplicateShipment}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
