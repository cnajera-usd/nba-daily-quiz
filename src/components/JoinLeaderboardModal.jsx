import { useState } from 'react'
import Modal from './Modal'
import { createProfile } from '@/lib/profiles'
import styles from './Modal.module.css'

export default function JoinLeaderboardModal({ onClose, onJoined }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (saving) return
    setError('')
    setSaving(true)
    const result = await createProfile(name)
    setSaving(false)
    if (result.ok) {
      onJoined({ username: name.trim() })
    } else {
      setError(result.message)
    }
  }

  return (
    <Modal title="Join the leaderboard" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p className={styles.about}>
          Want to show off your basketball knowledge? Pick a username to appear on the leaderboard and compete with other players.
        </p>

        <label className={styles.fieldLabel} htmlFor="username-input">Username</label>
        <input
          id="username-input"
          className={styles.input}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Choose a username"
          maxLength={25}
          autoComplete="off"
        />

        <ul className={styles.rules}>
          <li>3 to 25 characters</li>
          <li>Keep it friendly. Offensive names will be removed.</li>
          <li>Usernames are public</li>
        </ul>

        <div className={styles.error} role="alert">{error}</div>

        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={saving || name.trim().length < 3}
        >
          {saving ? 'Joining…' : 'Join'}
        </button>
      </form>
    </Modal>
  )
}