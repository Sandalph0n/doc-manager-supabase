'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/i18n/context'
import { shipmentFormSchema, type Shipment, type ShipmentFormValues } from '@/schemas/shipment'
import { updateShipment } from '@/app/(dashboard)/shipments/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide'>
        {label}
      </label>
      {children}
    </div>
  )
}

function ReadOnlyInput({ value }: { value?: string | null }) {
  return (
    <div className={cn(
      'h-8 rounded-md border bg-muted/40 px-3 flex items-center text-sm',
      !value && 'text-muted-foreground'
    )}>
      {value || '—'}
    </div>
  )
}

function EditableInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-8 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring w-full',
        className
      )}
      {...props}
    />
  )
}

export function InfoTab({ shipment }: { shipment: Shipment }) {
  const { t } = useLang()
  const s = t.shipments
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      doc_number:          shipment.doc_number,
      status:              shipment.status              ?? '',
      contract_date:       shipment.contract_date       ?? '',
      shipment_date:       shipment.shipment_date       ?? '',
      port_of_loading:     shipment.port_of_loading     ?? '',
      port_of_destination: shipment.port_of_destination ?? '',
      transport_mode:      shipment.transport_mode      ?? '',
      payment_terms:       shipment.payment_terms       ?? '',
      packing_type:        shipment.packing_type        ?? '',
      shipping_marks:      shipment.shipping_marks      ?? '',
    },
  })

  function handleCancel() {
    form.reset()
    setIsEditing(false)
  }

  async function onSubmit(data: ShipmentFormValues) {
    const { error } = await updateShipment(shipment.id, data)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Saved')
    setIsEditing(false)
    router.refresh()
  }

  const v = form.watch()

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 h-full p-4'>

      {/* Header row */}
      <div className='flex items-center justify-end gap-2'>
        {isEditing && (
          <Button type='button' variant='outline' size='sm' onClick={handleCancel}>
            {s.cancel}
          </Button>
        )}
        {isEditing
          ? <Button key='save' type='submit' size='sm' disabled={form.formState.isSubmitting}>{s.save}</Button>
          : <Button key='edit' type='button' size='sm' onClick={() => setIsEditing(true)}>{s.edit}</Button>
        }
      </div>

      {/* Fields */}
      <div className='grid grid-cols-2 gap-x-6 gap-y-4'>

        <Field label={s.docNumber}>
          {isEditing
            ? <EditableInput {...form.register('doc_number')} />
            : <ReadOnlyInput value={v.doc_number} />}
        </Field>

        <Field label={s.status}>
          {isEditing
            ? <EditableInput {...form.register('status')} />
            : <ReadOnlyInput value={v.status} />}
        </Field>

        <Field label={s.contractDate}>
          {isEditing
            ? <EditableInput type='date' {...form.register('contract_date')} />
            : <ReadOnlyInput value={v.contract_date} />}
        </Field>

        <Field label={s.shipmentDate}>
          {isEditing
            ? <EditableInput type='date' {...form.register('shipment_date')} />
            : <ReadOnlyInput value={v.shipment_date} />}
        </Field>

        <Field label={s.portOfLoading}>
          {isEditing
            ? <EditableInput {...form.register('port_of_loading')} />
            : <ReadOnlyInput value={v.port_of_loading} />}
        </Field>

        <Field label={s.portOfDestination}>
          {isEditing
            ? <EditableInput {...form.register('port_of_destination')} />
            : <ReadOnlyInput value={v.port_of_destination} />}
        </Field>

        <Field label={s.transportMode}>
          {isEditing
            ? <EditableInput {...form.register('transport_mode')} />
            : <ReadOnlyInput value={v.transport_mode} />}
        </Field>

        <Field label={s.paymentTerms}>
          {isEditing
            ? <EditableInput {...form.register('payment_terms')} />
            : <ReadOnlyInput value={v.payment_terms} />}
        </Field>

        <Field label={s.packingType}>
          {isEditing
            ? <EditableInput {...form.register('packing_type')} />
            : <ReadOnlyInput value={v.packing_type} />}
        </Field>

        <Field label={s.shippingMarks}>
          {isEditing
            ? <EditableInput {...form.register('shipping_marks')} />
            : <ReadOnlyInput value={v.shipping_marks} />}
        </Field>

      </div>
    </form>
  )
}
