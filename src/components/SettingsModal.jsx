import Modal from './Modal'
import { useTheme } from '@/hooks/useTheme'
import styles from './Modal.module.css'

export default function SettingsModal({ onClose }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

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

      <p className={styles.about}>
        A new 10-question NBA quiz every day. Your stats are saved on this device.
      </p>

      <p className={styles.disclaimer}>
        This game is not affiliated with or endorsed by the NBA or any NBA team.
      </p>
    </Modal>
  )
}