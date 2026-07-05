'use server'

import { createClient } from "@/lib/supabase/server"
import { sellerProfileFormSchema, SellerProfileFormValues } from "@/schemas/seller-profile"


export async function updateSellerProfile(data: SellerProfileFormValues, recordId: string) {
    // ── Auth check ──────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: {message: 'Unauthorized'} }

    // ── Validate ─────────────────────────────────────────────────────────────
    const parsed = sellerProfileFormSchema.safeParse(data)
    if (!parsed.success) return { error: {message:'Invalid data'} }

    // ── Update ───────────────────────────────────────────────────────────────
    const { error } = await supabase
        .from('seller_profile')
        .update(parsed.data)
        .eq('id', recordId)

    return { error }
}