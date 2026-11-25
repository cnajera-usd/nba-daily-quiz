import { useState } from 'react'
import Modal from './Modal'
import AccountModal from './AccountModal'
import { useTheme } from '@/hooks/useTheme'
import styles from './Modal.module.css'

export default function SettingsModal({ onClose }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const [showAccount, setShowAccount] = useState(false)

  if (showAccount) {
    return <AccountModal onClose={() => setShowAccount(false)} />
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className={styles.row}>
        <div>
          <div className={styles.rowTitle}>Dark theme</div>
          <div className={styles.rowSub}>Switch between dark and light mode</div>
        </div>
        <button
          className={`${styles.switch} ${isDark ? styles.switchOn : ''}`}
          role="switch"
          aria-checked={isDark}
          aria-label="Dark theme"
          onClick={toggle}
        >
          <span className={styles.knob} />
        </button>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowTitle}>Account</div>
          <div className={styles.rowSub}>Save your progress and play on any device</div>
        </div>
        <button className={styles.smallBtn} onClick={() => setShowAccount(true)}>
          Sign in
        </button>
      </div>

      <p className={styles.about}>
        Starting 10: a new 10-question NBA quiz every day. Your stats are saved on this device.
      </p>

      <p className={styles.disclaimer}>
        This game is not affiliated with or endorsed by the NBA or any NBA team.
      </p>
    </Modal>
  )
}