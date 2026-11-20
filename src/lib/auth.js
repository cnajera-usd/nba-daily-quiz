import { supabase } from './supabase'

export async function ensureSession() {
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        const { error } = await supabase.auth.signInAnonymously()

        if (error) {
            console.error('There was an error signing in anonymously:', error.message)
        }
    }

}