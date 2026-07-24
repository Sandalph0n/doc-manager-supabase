import { z } from 'zod'

export const customerSchema = z.object({
  id:                z.uuid(),
  company_name:      z.string().min(1),
  address:           z.string().optional(),
  contact_person:    z.string().optional(),
  phone:             z.string().optional(),
  email:             z.string().optional(),
  position:          z.string().optional(),
  tax_code:          z.string().optional(),
  bank_account:      z.string().optional(),
  swift_code:        z.string().optional(),
  bank_name:         z.string().optional(),
  bank_address:      z.string().optional(),
  bank_account_name: z.string().optional(),
  created_at:        z.string().optional(),
  updated_at:        z.string().optional(),
})

export const customerFormSchema = customerSchema.omit({ id: true, created_at: true, updated_at: true })

export type Customer           = z.infer<typeof customerSchema>
export type CustomerFormValues = z.infer<typeof customerFormSchema>
