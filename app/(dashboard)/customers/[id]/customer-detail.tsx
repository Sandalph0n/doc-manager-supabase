'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ChevronRight, Pencil, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerDialog } from '@/components/customer-dialog'
import { Customer } from '@/schemas/customer'
import { useLang } from '@/lib/i18n/context'
import { formatDate } from '@/lib/utils/date'

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className='text-muted-foreground hover:text-foreground transition-none opacity-0 group-hover:opacity-100 cursor-pointer'
    >
      {copied
        ? <Check className='size-4 text-green-500' />
        : <Copy className='size-4' />
      }
    </button>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value?: string | null }) {
  const display = value || 'N/A'
  return (
    <div className='group flex flex-col gap-1'>
      <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
        {label}
      </span>
      <div className='flex items-center gap-1.5'>
        <span className='text-sm'>{display}</span>
        {value && <CopyButton value={value} />}
      </div>
    </div>
  )
}

// ─── CustomerDetail ───────────────────────────────────────────────────────────
export default function CustomerDetail({ customer }: { customer: Customer }) {
  const router          = useRouter()
  const { t }           = useLang()
  const c               = t.customers
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Toolbar */}
      <div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Users className='size-3.5' />
          <ChevronRight className='size-4' />
          <button
            className='hover:text-foreground transition-none hover:cursor-pointer'
            onClick={() => router.push('/customers')}
          >
            {c.title}
          </button>
          <ChevronRight className='size-4' />
          <span className='text-foreground font-medium'>{customer.company_name}</span>
        </div>
        <div className='ml-auto'>
          <Button size='sm' className='h-7 text-xs gap-1.5' onClick={() => setOpen(true)}>
            <Pencil className='size-4' /> {c.editCustomer}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto p-6'>
        <div className='max-w-2xl flex flex-col gap-8'>

          {/* Basic info */}
          <div className='flex flex-col gap-5'>
            <Field label={c.companyName}   value={customer.company_name} />
            <Field label={c.address}       value={customer.address} />
            <Field label={c.contactPerson} value={customer.contact_person} />
            <Field label={c.position}      value={customer.position} />
            <Field label={c.phone}         value={customer.phone} />
            <Field label={c.email}         value={customer.email} />
            <Field label={c.taxCode}       value={customer.tax_code} />
          </div>

          {/* Divider */}
          <div className='h-px bg-border' />

          {/* Bank info */}
          <div className='flex flex-col gap-5'>
            <Field label={c.bankAccountName} value={customer.bank_account_name} />
            <Field label={c.bankAccount}     value={customer.bank_account} />
            <Field label={c.swiftCode}       value={customer.swift_code} />
            <Field label={c.bankName}        value={customer.bank_name} />
            <Field label={c.bankAddress}     value={customer.bank_address} />
          </div>

          {/* Divider */}
          <div className='h-px bg-border' />

          {/* Meta */}
          <div className='flex flex-col gap-5'>
            <Field label={c.createdAt} value={formatDate(customer.created_at)} />
          </div>

        </div>
      </div>

      <CustomerDialog
        key={customer.id}
        open={open}
        onOpenChange={setOpen}
        customer={customer}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
