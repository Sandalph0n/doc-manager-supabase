'use server'
import { createClient } from "@/lib/supabase/server"
import { CustomerFormValues, customerFormSchema } from "@/schemas/customer"

export async function createNewCustomer(data: CustomerFormValues){

    // ── Auth check ──────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: {message: 'Unauthorized'} }

    // ── Validate ─────────────────────────────────────────────────────────────
    const parsed = customerFormSchema.safeParse(data)
    if (!parsed.success) return { error: {message:'Invalid data'} }

    // ── Create ─────────────────────────────────────────────────────────────
    const { data: created, error } = await supabase
        .from("customer")
        .insert({...parsed.data})
        .select()
        .single()

    return { error, data: created }
}

export async function updateCustomer(id: string, data: CustomerFormValues) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Unauthorized' } }

    const parsed = customerFormSchema.safeParse(data)
    if (!parsed.success) return { error: { message: 'Invalid data' } }

    const { error } = await supabase
        .from('customer')
        .update(parsed.data)
        .eq('id', id)

    return { error }
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Unauthorized' } }

    const { error } = await supabase
        .from('customer')
        .delete()
        .eq('id', id)

    return { error }
}
