import { useState, useCallback } from 'react'
import HelpModal from './HelpModal'
import SettingsModal from './SettingsModal'
import styles from './HeaderButtons.module.css'

export default function HeaderButtons() {
  const [open, setOpen] = useState(null) // 'help' | 'settings' | null
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
      </div>

      {open === 'help' && <HelpModal onClose={close} />}
      {open === 'settings' && <SettingsModal onClose={close} />}
    </>
  )
}