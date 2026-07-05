'use client'

// ─── Imports ──────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { FormInput } from '@/components/form'
import { useLang } from '@/lib/i18n/context'
import { getRequiredFields } from '@/lib/utils/schema'
import { Customer, CustomerFormValues, customerFormSchema } from '@/schemas/customer'
import { createNewCustomer, updateCustomer, deleteCustomer } from '@/app/(dashboard)/customers/actions'
import { toast } from 'sonner'
export type { Customer }

// ─── Required fields (derived from schema) ────────────────────────────────────
const req = getRequiredFields(customerFormSchema)

// ─── CustomerDialog ───────────────────────────────────────────────────────────
export function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: {
  open:         boolean
  onOpenChange: (v: boolean) => void
  customer?:    Customer
  onSuccess?:   (customer?: Customer) => void
}) {
  const { t } = useLang()
  const c = t.customers
  const isEdit = !!customer

  function l(text: string, name: keyof CustomerFormValues) {
    return req.has(name)
      ? <>{text}<span className='text-destructive ml-0.5'>*</span></>
      : text
  }

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      company_name:   customer?.company_name   ?? '',
      address:        customer?.address        ?? '',
      contact_person: customer?.contact_person ?? '',
      phone:          customer?.phone          ?? '',
      email:          customer?.email          ?? '',
      position:       customer?.position       ?? '',
      tax_code:       customer?.tax_code       ?? '',
    },
  })

  async function onSubmit(data: CustomerFormValues) {
    const result = isEdit
      ? await updateCustomer(customer.id, data)
      : await createNewCustomer(data)

    if (result?.error) {
      const msg = result.error.message
      toast.error(
        msg === 'Unauthorized' ? c.errorUnauthorized :
        msg === 'Invalid data' ? c.errorInvalidData  :
        c.errorGeneric
      )
      return
    }

    toast.success(isEdit ? c.updateSuccess : c.createSuccess)
    onOpenChange(false)
    onSuccess?.(!isEdit && 'data' in result ? (result.data as Customer ?? undefined) : undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? c.editCustomer : c.newCustomerDialog}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <FormInput control={form.control} name='company_name'   label={l(c.companyName,   'company_name')}   placeholder='Sino Commerce Co., Ltd.' />
            <FormInput control={form.control} name='address'        label={l(c.address,       'address')}        placeholder='No. ..., Street ...' />
            <FormInput control={form.control} name='contact_person' label={l(c.contactPerson, 'contact_person')} placeholder='Zhang Wei' />
            <FormInput control={form.control} name='phone'          label={l(c.phone,         'phone')}          placeholder='+86 138 ...' />
            <FormInput control={form.control} name='email'          label={l(c.email,         'email')}          placeholder='contact@example.com' />
            <FormInput control={form.control} name='position'       label={l(c.position,      'position')}       placeholder='Manager' />
            <FormInput control={form.control} name='tax_code'       label={l(c.taxCode,       'tax_code')}       placeholder='...' />
          </div>

          <DialogFooter className='mt-6'>
            <Button variant='outline' size='sm' type='button' onClick={() => onOpenChange(false)}>
              {c.cancel}
            </Button>
            <Button size='sm' type='submit' disabled={form.formState.isSubmitting}>
              {isEdit ? c.save : c.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── DeleteCustomerDialog ─────────────────────────────────────────────────────
export function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: {
  open:         boolean
  onOpenChange: (v: boolean) => void
  customer:     Customer
  onSuccess?:   () => void
}) {
  const { t } = useLang()
  const c = t.customers
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const match = input === customer.company_name

  async function handleDelete() {
    if (!match) return
    setLoading(true)
    const result = await deleteCustomer(customer.id)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error.message)
      return
    }

    toast.success(c.deleteSuccess)
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-destructive'>{c.deleteTitle}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>
            {c.deleteConfirmPrompt} <span className='font-medium text-foreground'>{customer.company_name}</span>
          </p>
          <input
            className='h-8 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-destructive'
            placeholder={customer.company_name}
            value={input}
            onChange={e => setInput(e.target.value)}
            onPaste={e => e.preventDefault()}
          />
        </div>

        <DialogFooter>
          <Button variant='outline' size='sm' onClick={() => onOpenChange(false)}>
            {c.cancel}
          </Button>
          <Button
            variant='destructive' size='sm'
            disabled={!match || loading}
            onClick={handleDelete}
          >
            {c.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
