import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export default function Modal({ title, onClose, children }) {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            ref={closeRef}
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  )
}