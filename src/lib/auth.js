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

export async function signInWithGoogle() {
    if (!supabase) return { ok: false, message: 'Sign-in is unavailable right now' }

    const user = await getCurrentUser()
    const options = { redirectTo: window.location.origin }

    const { error } = user?.is_anonymous
        ? await supabase.auth.linkIdentity({ provider: 'google', options })
        : await supabase.auth.signInWithOAuth({ provider: 'google', options })

    if (error) {
        console.error('Google sign-in failed:', error.message)
        return { ok: false, message: 'Google sign-in failed. Please try again.' }
    }
    return { ok: true }
}

export async function handleGoogleRedirectError() {
    if (!supabase) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('error_code') !== 'identity_already_exists') return

    // Clean the error out of the address bar so a refresh doesn't repeat this
    window.history.replaceState(null, '', window.location.pathname)
    localStorage.removeItem('nba-quiz-state')
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
    })
}

export async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
}