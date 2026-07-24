import { z } from 'zod'

export const shipmentDocumentSchema = z.object({
  id:                z.string().uuid(),
  shipment_id:       z.string().uuid(),
  doc_type:          z.string(),
  file_name:         z.string(),
  storage_path:      z.string().nullable().optional(),
  is_auto_generated: z.boolean(),
  uploaded_at:       z.string().nullable().optional(),
})

export type ShipmentDocument = z.infer<typeof shipmentDocumentSchema>

export type ShipmentDocumentPayload = {
  shipment_id:        string
  doc_type:           string
  file_name:          string
  storage_path?:      string | null
  is_auto_generated:  boolean
}
