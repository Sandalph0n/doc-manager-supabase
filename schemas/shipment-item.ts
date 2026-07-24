import { z } from 'zod'

export const shipmentItemSchema = z.object({
  id:             z.string().uuid(),
  shipment_id:    z.string().uuid(),
  item_no:        z.number().int().nullable().optional(),
  name_en:        z.string(),
  name_cn:        z.string().nullable().optional(),
  name_other:     z.string().nullable().optional(),
  hs_code:        z.string().nullable().optional(),
  specification:  z.string().nullable().optional(),
  quantity:       z.number().int().nullable().optional(),
  unit_price_usd: z.number().nullable().optional(),
  num_packages:   z.number().int().nullable().optional(),
  nw_kg:          z.number().nullable().optional(),
  gw_kg:          z.number().nullable().optional(),
  cbm:            z.number().nullable().optional(),
})

export type ShipmentItem = z.infer<typeof shipmentItemSchema>

export type ShipmentItemPayload = {
  name_en:         string
  name_cn?:        string | null
  name_other?:     string | null
  hs_code?:        string | null
  specification?:  string | null
  quantity?:       number | null
  unit_price_usd?: number | null
  num_packages?:   number | null
  nw_kg?:          number | null
  gw_kg?:          number | null
  cbm?:            number | null
}
