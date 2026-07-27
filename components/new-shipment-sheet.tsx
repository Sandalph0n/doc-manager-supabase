'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Temporal } from '@js-temporal/polyfill'
import { Plus, ChevronDown, Search, Check, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { createShipment, getNextDocNumber } from '@/app/(dashboard)/shipments/actions'
import { useLang } from '@/lib/i18n/context'
import { CustomerDialog } from '@/components/customer-dialog'
import type { Customer } from '@/schemas/customer'
import { toast } from 'sonner'



type CustomerOption = { id: string; company_name: string }

// ─── Customer Combobox ────────────────────────────────────────────────────────
function CustomerCombobox({
  value, onChange,
}: {
  value: CustomerOption | null
  onChange: (c: CustomerOption) => void
}) {
  const { t } = useLang()
  const s = t.shipments
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<CustomerOption[]>([])
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchCustomers(q: string) {
    startTransition(async () => {
      const supabase = createClient()
      if (q.trim()) {
        const { data } = await supabase.rpc('search_customers', { q: q.trim(), p_from: 1, p_to: 20 })
        setResults((data ?? []).map((r: CustomerOption & { total?: number }) => ({ id: r.id, company_name: r.company_name })))
      } else {
        const { data } = await supabase
          .from('customer')
          .select('id, company_name')
          .order('company_name')
          .limit(20)
        setResults(data ?? [])
      }
    })

  }

  function handleSearch(val: string) {
    setSearch(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fetchCustomers(val), 300)
  }


  // Fetch khi mở popover lần đầu (search rỗng = top 20)
  useEffect(() => {
    if (!open) return
    fetchCustomers('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          'h-8 w-full rounded-md border bg-background px-3 text-sm flex items-center justify-between gap-2 outline-none focus:ring-1 focus:ring-ring',
          !value && 'text-muted-foreground'
        )}>
          <span className='truncate'>{value ? value.company_name : s.selectCustomer}</span>
          <ChevronDown className='size-3.5 text-muted-foreground shrink-0' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
        {/* Search input */}
        <div className='flex items-center gap-2 px-3 py-2 border-b'>
          {isPending
            ? <Loader2 className='size-3.5 text-muted-foreground shrink-0 animate-spin' />
            : <Search className='size-3.5 text-muted-foreground shrink-0' />
          }
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder={s.searchCustomer}
            className='text-sm outline-none bg-transparent flex-1'
            autoFocus
          />
        </div>
        {/* Results */}
        <div className='max-h-52 overflow-auto py-1'>
          {results.length === 0
            ? <p className='px-3 py-2 text-xs text-muted-foreground'>
              {isPending ? s.searching : s.notFound}
            </p>
            : results.map(c => (
              <button
                key={c.id}
                className='w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2'
                onClick={() => { onChange(c); setSearch(''); setOpen(false) }}
              >
                <span className='truncate'>{c.company_name}</span>
                {value?.id === c.id && <Check className='size-3.5 shrink-0' />}
              </button>
            ))
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── NewShipmentSheet ─────────────────────────────────────────────────────────
export default function NewShipmentSheet() {
  const { t } = useLang()
  const s = t.shipments
  const router = useRouter()

  const [open, setOpen]                   = useState(false)
  const [mode, setMode]                   = useState<'default' | 'custom'>('default')
  const [customName, setCustomName]       = useState('')
  const [customer, setCustomer]           = useState<CustomerOption | null>(null)
  const [previewDocNumber, setPreview]              = useState<string | null>(null)
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [, startTransition]                         = useTransition()
  const [loading, setLoading] = useState(false);

  const utcDateStr = Temporal.Now.plainDateISO('UTC').toString()

  useEffect(() => {
    if (!open) return
    startTransition(async () => {
      setPreview(null)
      const docNumber = await getNextDocNumber()
      setPreview(docNumber)
    })
  }, [open])

  async function handleCreateShipment(){
    setLoading(true)
    const docName = mode == "default" ? previewDocNumber : customName
    
    if (!docName){
      toast.error(s.customNameRequired)
      setLoading(false);
      return;
    }
    if (!customer?.id){
      toast.error(s.selectCustomerRequired)
      setLoading(false);
      return
    }
    

    const {error, newShipment} = await createShipment(docName, customer?.id)

    if (error){
      toast.error(error.message)
      setLoading(false);
      return;
    } 
    if(!newShipment){
      toast.error("Cannot create new shipment")
      setLoading(false);
      return;
    } 

    setLoading(false);
    router.push(`/shipments/${newShipment.id}`)
  
  }


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='sm' className='h-7 text-xs gap-1.5'>
          <Plus className='size-3' /> {s.newShipment}
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col p-0 sm:max-w-xs'>
        {/* Header */}
        <SheetHeader className='px-5 py-4 border-b'>
          <SheetTitle>{s.newShipmentTitle}</SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className='flex-1 overflow-auto p-5 flex flex-col gap-6'>

          {/* Doc number */}
          <div className='flex flex-col gap-2'>
            <label className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
              {s.docNumber}
            </label>

            {/* Mode toggle */}
            <div className='flex w-fit rounded-md border overflow-hidden text-xs font-medium'>
              {(['default', 'custom'] as const).map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'px-3 py-1.5 transition-colors',
                    i > 0 && 'border-l',
                    mode === m
                      ? 'bg-foreground text-background'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  {m === 'default' ? s.autoName : s.customName}
                </button>
              ))}
            </div>

            {mode === 'default' ? (
              <>
                <div className='h-8 rounded-md border bg-muted px-3 flex items-center'>
                  <span className='text-sm text-muted-foreground font-mono'>
                    {previewDocNumber ?? s.loading}
                  </span>
                </div>
                <p className='text-[10px] text-muted-foreground'>UTC · {utcDateStr}</p>
              </>
            ) : (
              <input
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder={s.customNamePlaceholder}
                className='h-8 rounded-md border bg-background px-3 text-sm font-mono outline-none focus:ring-1 focus:ring-ring'
              />
            )}
          </div>

          {/* Customer */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <label className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
                {s.customer}
              </label>
              <Button
                variant="ghost"
                onClick={() => setCustomerDialogOpen(true)}
                className='flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-none hover:cursor-pointer'
              >
                <UserPlus className='size-3' />
                {s.newCustomer}
              </Button>
            </div>
            <CustomerCombobox value={customer} onChange={setCustomer} />
          </div>

          <CustomerDialog
            key={customerDialogOpen ? 'open' : 'closed'}
            open={customerDialogOpen}
            onOpenChange={setCustomerDialogOpen}
            onSuccess={(c?: Customer) => {
              if (c) setCustomer({ id: c.id, company_name: c.company_name })
            }}
          />

        </div>

        {/* Footer */}
        <div className='px-5 py-4 border-t flex justify-end gap-2'>
          <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
            {s.cancel}
          </Button>
          {/* Create shipment button */}
          <Button size='sm' onClick={handleCreateShipment} disabled={loading}>
            {s.create}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
