import { z } from 'zod'

export const shipmentSchema = z.object({
    id: z.uuid(),
    doc_number: z.string(),
    customer_id: z.uuid(),

    contract_date:              z.string().optional(),
    shipment_date:              z.string().optional(),
    port_of_loading:            z.string().optional(),
    port_of_destination:        z.string().optional(),
    transport_mode:             z.string().optional(),
    payment_terms:              z.string().optional(),
    packing_type:               z.string().optional(),
    shipping_marks:             z.string().optional(),
    status:                     z.string().optional(),
    created_at:                 z.string().optional(),
    updated_at:                 z.string().optional(),
})

export const shipmentFormSchema = shipmentSchema.pick({
    doc_number:          true,
    status:              true,
    contract_date:       true,
    shipment_date:       true,
    port_of_loading:     true,
    port_of_destination: true,
    transport_mode:      true,
    payment_terms:       true,
    packing_type:        true,
    shipping_marks:      true,
}).partial({ // tất cả optional trừ doc_number
    status:              true,
    contract_date:       true,
    shipment_date:       true,
    port_of_loading:     true,
    port_of_destination: true,
    transport_mode:      true,
    payment_terms:       true,
    packing_type:        true,
    shipping_marks:      true,
})

export type Shipment           = z.infer<typeof shipmentSchema>
export type ShipmentFormValues = z.infer<typeof shipmentFormSchema>

