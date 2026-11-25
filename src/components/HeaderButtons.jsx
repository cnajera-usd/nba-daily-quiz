import { useState, useCallback } from 'react'
import HelpModal from './HelpModal'
import SettingsModal from './SettingsModal'
import AccountModal from './AccountModal'
import styles from './HeaderButtons.module.css'

export default function HeaderButtons() {
  const [open, setOpen] = useState(null) // 'help' | 'settings' | 'account' | null
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <div className={styles.group}>
        <button className={styles.btn} onClick={() => setOpen('help')} aria-label="How to play" title="How to play">
          ?
        </button>
        <button className={styles.btn} onClick={() => setOpen('settings')} aria-label="Settings" title="Settings">
          ⚙
        </button>
        <button className={styles.btn} onClick={() => setOpen('account')} aria-label="Sign in or sign up" title="Sign in / Sign up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
        </button>
      </div>

      {open === 'help' && <HelpModal onClose={close} />}
      {open === 'settings' && <SettingsModal onClose={close} />}
      {open === 'account' && <AccountModal onClose={close} />}
    </>
  )
}