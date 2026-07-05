import { createClient } from '@/lib/supabase/server'
import { Customer } from '@/schemas/customer'
import { notFound } from 'next/navigation'
import CustomerDetail from './customer-detail'

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }   = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return <CustomerDetail customer={data as Customer} />
}
