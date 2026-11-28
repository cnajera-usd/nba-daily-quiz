import { useEffect, useState } from 'react'
import Modal from './Modal'
import styles from './Modal.module.css'
import { getCurrentUser, signInWithGoogle, signOut } from '../lib/auth'

export default function AccountModal({ onClose }) {
    const [user, setUser] = useState(undefined) // undefined = still loading
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let cancelled = false
        getCurrentUser().then((u) => {
            if (!cancelled) setUser(u)
        })
        return () => {
            cancelled = true
        }
    }, [])

    async function handleGoogle() {
        setBusy(true)
        setError('')
        const result = await signInWithGoogle()
        // On success the browser leaves for Google, so we only handle failure here
        if (!result.ok) {
            setError(result.message)
            setBusy(false)
        }
    }

    async function handleSignOut() {
        await signOut()
        localStorage.removeItem('nba-quiz-state')
        window.location.reload() // main.jsx creates a fresh guest session on load
    }

    const signedIn = user && !user.is_anonymous

    return (
        <Modal title={signedIn ? 'Account' : 'Sign in / Sign up'} onClose={onClose}>
            {user === undefined ? null : signedIn ? (
                <>
                    <p className={styles.rules}>Signed in as {user.email}</p>
                    <button className={styles.secondaryBtn} onClick={handleSignOut}>
                        Sign out
                    </button>
                </>
            ) : (
                <>
                    <p className={styles.rules}>
                        You're playing as a guest. Sign in with Google to keep your scores and username,
                        and to play on any device.
                    </p>
                    <button className={styles.primaryBtn} onClick={handleGoogle} disabled={busy}>
                        Continue with Google
                    </button>
                    <p className={styles.rules}>
                        Already have an account? Just use the same Google account. Scores you earned as a
                        guest on this device won't carry over to an existing account.
                    </p>
                    {error && <div className={styles.error}>{error}</div>}
                </>
            )}
        </Modal>
    )
}