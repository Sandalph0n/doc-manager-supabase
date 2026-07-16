'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ChevronRight, Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { CustomerDialog, DeleteCustomerDialog } from '@/components/customer-dialog'
import { Customer } from '@/schemas/customer'
import { useLang } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/date'
import Link from 'next/link'

// ─── Range Popover ────────────────────────────────────────────────────────────
function RangePopover({ from, to, total, query }: { from: number; to: number; total: number; query?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [fromVal, setFromVal] = useState(String(from))
  const [toVal, setToVal] = useState(String(to))

  const fromNum = parseInt(fromVal) || 0
  const toNum = parseInt(toVal) || 0

  const fromErr = isNaN(fromNum) || fromNum < 1 || fromNum > total
    ? `1 – ${total}` : fromNum > toNum ? `≤ ${toVal}` : null
  const toErr = isNaN(toNum) || toNum < 1 || toNum > total
    ? `1 – ${total}` : toNum < fromNum ? `≥ ${fromVal}` : null

  const valid = !fromErr && !toErr

  function apply() {
    if (!valid) return
    const qPart = query ? `&q=${encodeURIComponent(query)}` : ''
    router.push(`?from=${fromNum}&to=${toNum}${qPart}`)
    setOpen(false)
  }

  function onOpenChange(v: boolean) {
    if (v) { setFromVal(String(from)); setToVal(String(to)) }
    setOpen(v)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className='text-xs text-foreground font-medium tabular-nums hover:underline underline-offset-2 cursor-pointer'>
          {from} – {to}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-52 p-3' align='center'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-[11px] text-muted-foreground'>From</label>
            <input
              type='number' min={1} max={total} value={fromVal}
              onChange={e => setFromVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && apply()}
              className='h-7 rounded-md border bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring tabular-nums'
            />
            {fromErr && <span className='text-[10px] text-destructive'>{fromErr}</span>}
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-[11px] text-muted-foreground'>To</label>
            <input
              type='number' min={1} max={total} value={toVal}
              onChange={e => setToVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && apply()}
              className='h-7 rounded-md border bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring tabular-nums'
            />
            {toErr && <span className='text-[10px] text-destructive'>{toErr}</span>}
          </div>
          <Button size='sm' className='h-7 text-xs' disabled={!valid} onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── CustomerTable ────────────────────────────────────────────────────────────
export default function CustomerTable({
  customers,
  total,
  from,
  to,
  query,
}: {
  customers: Customer[]
  total: number
  from: number
  to: number
  query?: string
}) {
  const router = useRouter()
  const { t } = useLang()
  const c = t.customers

  // ── Search ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState(query ?? '')
  const isSearching = !!query?.trim()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(val: string) {
    setSearch(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (val.trim()) router.push(`?q=${encodeURIComponent(val.trim())}`)
      else router.push('?from=1&to=20')
    }, 300)
  }

  function clearSearch() {
    setSearch('')
    router.push('?from=1&to=20')
  }

  // ── Dialogs ─────────────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Customer | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Customer | undefined>()

  function openCreate() { setEditTarget(undefined); setDialogOpen(true) }
  function openEdit(row: Customer) { setEditTarget(row); setDialogOpen(true) }
  function openDelete(row: Customer) { setDeleteTarget(row); setDeleteDialogOpen(true) }

  useEffect(() => {
    customers.forEach(c => router.prefetch(`/customers/${c.id}`))
  }, [customers, router])

  return (
    <div className='h-full flex flex-col '>
      {/* Toolbar */}
      <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Users className='size-3.5' />
          <ChevronRight className='size-3' />
          <span className='text-foreground font-medium'>{c.title}</span>
          {isSearching && (
            <>
              <ChevronRight className='size-3' />
              <span>{c.searching} &ldquo;{query}&rdquo;</span>
            </>
          )}
          <ChevronRight className='size-3' />
          <RangePopover from={from} to={to} total={total} query={query} />
        </div>
        <div className='ml-auto'>
          <Button size='sm' className='h-7 text-xs gap-1.5' onClick={openCreate}>
            <Plus className='size-3' /> {c.newCustomer}
          </Button>
        </div>
      </div>


      <div className='flex-1 flex overflow-auto flex-col pb-0 p-4'>
        <div className='flex items-center justify-between mb-3 min-w-max'>
          <p className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
            {isSearching
              ? `${total} results for "${query}"`
              : `${c.allCustomers} — ${total} records`}
          </p>

          {/* Search input */}
          <div className='relative flex items-center'>
            <Search className='absolute left-2 size-3 text-muted-foreground pointer-events-none' />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={c.searchPlaceholder}
              className='h-7 w-48 rounded-md border bg-background pl-6 pr-6 text-xs outline-none focus:ring-1 focus:ring-ring'
            />
            {search && (
              <button onClick={clearSearch} className='absolute right-2 text-muted-foreground hover:text-foreground'>
                <X className='size-3' />
              </button>
            )}
          </div>
        </div>


        <div className='flex-1'>
          <table className='min-w-max text-sm border-collapse w-full'>
            <thead>
              <tr className='border-b'>
                {[c.companyName, c.taxCode, c.contactPerson, c.position , c.phone, c.email, c.address, c.createdAt].map(h => (
                  <th key={h} className='text-left text-[11px] font-medium text-muted-foreground pb-2 px-2'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0
                ? <tr><td colSpan={7} className='px-2 py-8 text-center text-xs text-muted-foreground'>No results</td></tr>
                : customers.map(row => (
                  <tr
                    key={row.id}
                    className='group border-b hover:bg-muted/40 hover:cursor-pointer align-middle '
                    onClick={() => router.push(`/customers/${row.id}`)}
                  >
                    <td className='px-2 py-2 font-medium max-w-50' >{row.company_name || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground' >{row.tax_code || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.contact_person || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.position || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.phone || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground'>{row.email || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground max-w-50'>{row.address || "N/A"}</td>
                    <td className='px-2 py-2 text-muted-foreground'>
                      {formatDate(row.created_at)}
                    </td>
                    <td className='px-2 py-2 w-16 sticky right-0 top-2.5 ' >
                      <div className='flex items-center gap-0.5 invisible group-hover:visible bg-background border rounded-md shadow-md px-0.5'>
                        <Button variant='ghost' size='icon-sm' className='size-6 hover:cursor-pointer transition-none' 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(row);
                          }}
                        >
                          <Pencil className='size-3' />
                        </Button>
                        <Button variant='ghost' size='icon-sm' className='size-6 text-destructive hover:text-destructive hover:cursor-pointer transition-none' 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDelete(row)
                          }}  
                        >
                          <Trash2 className='size-3' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>

      <CustomerDialog
        key={editTarget?.id ?? 'new'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editTarget}
        onSuccess={() => router.refresh()}
      />

      {deleteTarget && (
        <DeleteCustomerDialog
          key={deleteTarget.id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          customer={deleteTarget}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}
