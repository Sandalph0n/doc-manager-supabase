"use client"

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, Save, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { SaleContract } from './sale-contract'
import { CommercialInvoice } from './commercial-invoice'
import { PackingList } from './packing-list'
import { generateContractBlob } from './sale-contract'
import { generateInvoiceBlob } from './commercial-invoice'
import { generatePackingListBlob } from './packing-list'
import { useLang } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'
import { useGenerateCtx } from '../../generate-context'
import { initDoc, initInvoice, initPackingList } from '../../generate-types'
import type { ContractDoc, InvoiceDoc, PackingListDoc } from '../../generate-types'
import type { Customer } from '@/schemas/customer'

const BUCKET = 'shipment-documents'

const triggerClass = 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-10 px-4 text-xs'

// ── Helpers ───────────────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

type DocEntry = {
  docType:  'contract' | 'invoice' | 'packing_list'
  suffix:   string          // CT | INV | PL
  docNo:    string          // from doc fields, used for filename
  blob:     Blob
}

async function uploadAndRecord(
  supabase: ReturnType<typeof createClient>,
  shipmentId: string,
  ts: number,
  entry: DocEntry,
): Promise<void> {
  const fileName    = `${entry.docNo || shipmentId}_${entry.suffix}.pdf`
  const storagePath = `shipments/${shipmentId}/${ts}_${entry.suffix}.pdf`

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, entry.blob, { contentType: 'application/pdf', upsert: true })

  if (uploadErr) throw new Error(`Upload ${entry.docType}: ${uploadErr.message}`)

  const { error: dbErr } = await supabase.from('shipment_document').insert({
    shipment_id:      shipmentId,
    doc_type:         entry.docType,
    file_name:        fileName,
    storage_path:     storagePath,
    is_auto_generated: true,
  })

  if (dbErr) throw new Error(`DB insert ${entry.docType}: ${dbErr.message}`)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GenerateClient({ shipmentId }: { shipmentId: string }) {
  const { t } = useLang()
  const s = t.shipments
  const ctx = useGenerateCtx()

  const [isGenerating, setIsGenerating]             = useState(false)
  const [isSaving, setIsSaving]                     = useState(false)
  const [downloadImmediately, setDownloadImmediately] = useState(false)

  // ── Generate ────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    setIsGenerating(true)
    const supabase = createClient()

    const [{ data: shipment }, { data: items }, { data: seller }] = await Promise.all([
      supabase.from('shipment').select('*').eq('id', shipmentId).single(),
      supabase.from('shipment_item').select('*').eq('shipment_id', shipmentId).order('item_no', { ascending: true }),
      supabase.from('seller_profile').select('*').limit(1).maybeSingle(),
    ])

    let customer: Customer | null = null
    if (shipment?.customer_id) {
      const { data: c } = await supabase.from('customer').select('*').eq('id', shipment.customer_id).single()
      customer = c
    }

    const generatedData = { shipment: shipment ?? {}, items: items ?? [], seller, customer }
    ctx.setContract(shipmentId,    initDoc(generatedData))
    ctx.setInvoice(shipmentId,     initInvoice(generatedData))
    ctx.setPackingList(shipmentId, initPackingList(generatedData))
    setIsGenerating(false)
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave() {
    const drafts = ctx.getDrafts(shipmentId)
    const { contract, invoice, packingList } = drafts

    if (!contract && !invoice && !packingList) {
      toast.error('Chưa có tài liệu nào để lưu. Hãy bấm Generate trước.')
      return
    }

    setIsSaving(true)
    const supabase = createClient()
    const ts = Date.now()

    try {
      // Generate blobs for whichever docs exist
      const jobs: Array<Promise<DocEntry>> = []

      if (contract) {
        jobs.push(
          generateContractBlob(contract).then(blob => ({
            docType: 'contract' as const,
            suffix:  'CT',
            docNo:   contract.ctNo || shipmentId,
            blob,
          }))
        )
      }
      if (invoice) {
        jobs.push(
          generateInvoiceBlob(invoice).then(blob => ({
            docType: 'invoice' as const,
            suffix:  'INV',
            docNo:   invoice.invNo || shipmentId,
            blob,
          }))
        )
      }
      if (packingList) {
        jobs.push(
          generatePackingListBlob(packingList).then(blob => ({
            docType: 'packing_list' as const,
            suffix:  'PL',
            docNo:   packingList.plNo || shipmentId,
            blob,
          }))
        )
      }

      const entries = await Promise.all(jobs)

      // Upload + insert DB records
      await Promise.all(entries.map(e => uploadAndRecord(supabase, shipmentId, ts, e)))

      // Optionally download
      if (downloadImmediately) {
        entries.forEach(e => {
          const fileName = `${e.docNo || shipmentId}_${e.suffix}.pdf`
          triggerDownload(e.blob, fileName)
        })
      }

      toast.success(`Đã lưu ${entries.length} tài liệu thành công.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Cancel ──────────────────────────────────────────────────────────────────

  function handleCancel() {
    ctx.clearAll(shipmentId)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const drafts     = ctx.getDrafts(shipmentId)
  const hasContent = !!(drafts.contract || drafts.invoice || drafts.packingList)

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <Tabs defaultValue='contract' className='flex-1 flex flex-col overflow-hidden gap-0'>
        <div className='border-b px-4 flex items-center justify-between'>
          <TabsList className='h-10 bg-transparent p-0 gap-0'>
            <TabsTrigger value='contract'     className={triggerClass}>{s.tabSaleContract}</TabsTrigger>
            <TabsTrigger value='invoice'      className={triggerClass}>{s.tabCommercialInvoice}</TabsTrigger>
            <TabsTrigger value='packing-list' className={triggerClass}>{s.tabPackingList}</TabsTrigger>
          </TabsList>
          <Button size='sm' className='h-7 text-xs gap-1.5' onClick={handleGenerate} disabled={isGenerating || isSaving}>
            {isGenerating
              ? <Loader2 className='size-3 animate-spin' />
              : <Sparkles className='size-3' />
            }
            {s.generate}
          </Button>
        </div>

        <TabsContent forceMount value='contract'     className='flex-1 m-0 data-[state=inactive]:hidden flex flex-col overflow-hidden'>
          <SaleContract shipmentId={shipmentId} />
        </TabsContent>
        <TabsContent forceMount value='invoice'      className='flex-1 m-0 data-[state=inactive]:hidden flex flex-col overflow-hidden'>
          <CommercialInvoice shipmentId={shipmentId} />
        </TabsContent>
        <TabsContent forceMount value='packing-list' className='flex-1 m-0 data-[state=inactive]:hidden flex flex-col overflow-hidden'>
          <PackingList shipmentId={shipmentId} />
        </TabsContent>
      </Tabs>

      <div className='border-t px-4 h-12 flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='download-immediately'
            checked={downloadImmediately}
            onCheckedChange={v => setDownloadImmediately(!!v)}
          />
          <Label htmlFor='download-immediately' className='text-xs font-normal cursor-pointer'>
            {s.downloadImmediately}
          </Label>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='h-7 text-xs gap-1.5' onClick={handleCancel} disabled={isSaving}>
            <X className='size-3' />
            {s.cancel}
          </Button>
          <Button size='sm' className='h-7 text-xs gap-1.5' onClick={handleSave} disabled={isSaving || !hasContent}>
            {isSaving
              ? <Loader2 className='size-3 animate-spin' />
              : <Save className='size-3' />
            }
            {s.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
