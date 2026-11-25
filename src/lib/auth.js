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


export async function getCurrentUser() {
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function signInWithGoogle({ link }) {
    if (!supabase) return { ok: false, message: 'Sign-in is unavailable right now' }

    const options = { redirectTo: window.location.origin }
    const { error } = link
        ? await supabase.auth.linkIdentity({ provider: 'google', options })
        : await supabase.auth.signInWithOAuth({ provider: 'google', options })

    if (error) {
        console.error('Google sign-in failed:', error.message)
        if (link && error.message.toLowerCase().includes('already')) {
            return {
                ok: false,
                message: 'That Google account already has a Starting 10 profile. Use "Sign in to existing account" instead.',
            }
        }
        return { ok: false, message: 'Google sign-in failed. Please try again.' }
    }
    return { ok: true }
}

export async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
}