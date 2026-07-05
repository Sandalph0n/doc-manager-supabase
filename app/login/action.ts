'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/schemas/login'
import z from 'zod'

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionResult = { success: false; error: string }

// ─── Actions ──────────────────────────────────────────────────────────────────
export async function login(data: z.infer<typeof loginSchema>): Promise<ActionResult> {
    const result = loginSchema.safeParse(data)

    
    if (!result.success) {
        return { success: false, error: 'Invalid input' }
    }
    
    const supabase = await createClient()


    const { error } = await supabase.auth.signInWithPassword(result.data)
    console.log(error)
    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
