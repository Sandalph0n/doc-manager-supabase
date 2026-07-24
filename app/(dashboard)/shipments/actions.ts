'use server'

import { Temporal } from '@js-temporal/polyfill'
import { createClient } from '@/lib/supabase/server'
import { shipmentFormSchema, type ShipmentFormValues } from '@/schemas/shipment'
import { type ShipmentItemPayload, type ShipmentItem } from '@/schemas/shipment-item'

export async function getNextDocNumber(): Promise<string> {
  const supabase = await createClient()

  const today = Temporal.Now.plainDateISO('UTC')
  const dayStart = today.toZonedDateTime('UTC').toInstant().toString()
  const dayEnd = today.add({ days: 1 }).toZonedDateTime('UTC').toInstant().toString()
  const dateStr = today.toString().replace(/-/g, '') // '20260704'

  const { count } = await supabase
    .from('shipment')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', dayStart)
    .lt('created_at', dayEnd)

  const seq = String((count ?? 0) + 1).padStart(3, '0')
  return `${dateStr}-${seq}`
}




export async function createShipment(docName: string, customerId: string) {
  // ── Auth check ──────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Unauthorized' } }

  // ── Validate ────────────────────────────────────────────────────────────

  const {data} = await supabase.from("customer").select("id, company_name").eq("id", customerId)


  if (!data || data.length < 1){
    return {error: { message: `Can not find customer: ${customerId}`}}
  }
  
  const {data: newShipment, error} = await supabase.from("shipment").insert({
    doc_number: docName, // yes, doc name and doc number is the same
    customer_id: customerId
  }).select().single()


  return {error, newShipment}
}

export async function updateShipment(id: string, data: ShipmentFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Unauthorized' } }

  const parsed = shipmentFormSchema.safeParse(data)
  if (!parsed.success) return { error: { message: 'Invalid data' } }

  // empty string → null để tránh PostgreSQL báo lỗi invalid date
  const cleaned = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v === '' ? null : v])
  )

  const { error } = await supabase
    .from('shipment')
    .update(cleaned)
    .eq('id', id)

  return { error }
}

// ── Shipment Item CRUD ───────────────────────────────────────────────────────

export async function getShipmentItems(shipmentId: string): Promise<{ data: ShipmentItem[]; error: unknown }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shipment_item')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('item_no', { ascending: true })
  return { data: data ?? [], error }
}

export async function addShipmentItem(shipmentId: string, values: ShipmentItemPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Unauthorized' } }

  const { count } = await supabase
    .from('shipment_item')
    .select('*', { count: 'exact', head: true })
    .eq('shipment_id', shipmentId)

  const { error } = await supabase
    .from('shipment_item')
    .insert({ ...values, shipment_id: shipmentId, item_no: (count ?? 0) + 1 })

  return { error }
}

export async function updateShipmentItem(id: string, values: ShipmentItemPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Unauthorized' } }

  const { error } = await supabase
    .from('shipment_item')
    .update(values)
    .eq('id', id)

  return { error }
}

export async function deleteShipmentItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Unauthorized' } }

  const { error } = await supabase
    .from('shipment_item')
    .delete()
    .eq('id', id)

  return { error }
}