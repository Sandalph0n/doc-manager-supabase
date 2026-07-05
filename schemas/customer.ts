import { z } from 'zod'

export const customerSchema = z.object({
  id:             z.uuid(),
  company_name:   z.string().min(1),
  address:        z.string().min(1),
  contact_person: z.string().min(1),
  phone:          z.string().min(1),
  email:          z.email(),
  position:       z.string().optional(),
  tax_code:       z.string().optional(),
  created_at:     z.string().optional(),
  updated_at:     z.string().optional(),
})

export const customerFormSchema = customerSchema.omit({ id: true, created_at: true, updated_at: true })

export type Customer           = z.infer<typeof customerSchema>
export type CustomerFormValues = z.infer<typeof customerFormSchema>
