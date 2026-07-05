'use server'

import { Temporal } from '@js-temporal/polyfill'
import { createClient } from '@/lib/supabase/server'

export async function getNextDocNumber(): Promise<string> {
  const supabase = await createClient()

  const today    = Temporal.Now.plainDateISO('UTC')
  const dayStart = today.toZonedDateTime('UTC').toInstant().toString()
  const dayEnd   = today.add({ days: 1 }).toZonedDateTime('UTC').toInstant().toString()
  const dateStr  = today.toString().replace(/-/g, '') // '20260704'

  const { count } = await supabase
    .from('shipment')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', dayStart)
    .lt('created_at', dayEnd)

  const seq = String((count ?? 0) + 1).padStart(3, '0')
  return `${dateStr}-${seq}`
}


export async function createShipment(){

  
}