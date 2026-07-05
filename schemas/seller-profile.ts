import { z } from 'zod'

export const sellerProfileSchema = z.object({
  id: z.uuid(),

  // ── Company name (3 languages) ───────────────────────────────────────────
  company_name_vi: z.string().min(1),
  company_name_en: z.string().min(1),
  company_name_cn: z.string().min(1),

  // ── Address (3 languages) ────────────────────────────────────────────────
  address_vi: z.string().optional(),
  address_en: z.string().optional(),
  address_cn: z.string().optional(),

  // ── Authorized person ────────────────────────────────────────────────────
  authorized_person: z.string().min(1),
  position:          z.string().optional(),

  // ── Tax ──────────────────────────────────────────────────────────────────
  tax_code: z.string().min(1),

  // ── Bank ─────────────────────────────────────────────────────────────────
  bank_account:       z.string().optional(),
  bank_account_name:  z.string().optional(),
  swift_code:         z.string().optional(),
  bank_name:          z.string().optional(),
  bank_address:       z.string().optional(),
})

export const sellerProfileFormSchema = sellerProfileSchema.omit({ id: true })

export type SellerProfileFormValues = z.infer<typeof sellerProfileFormSchema>
