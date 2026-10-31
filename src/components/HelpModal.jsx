import Modal from './Modal'
import styles from './Modal.module.css'

export default function HelpModal({ onClose }) {
  return (
    <Modal title="How to play" onClose={onClose}>
      <ol className={styles.steps}>
        <li>You get 10 NBA trivia questions. A new quiz goes live every day at midnight Pacific.</li>
        <li>Pick an answer. You'll see right away whether you got it right, along with a little extra info.</li>
        <li>When you finish, review every question and see what you missed.</li>
        <li>Play every day to build your streak. Your stats are saved in this browser.</li>
      </ol>

      <div className={styles.note}>
        <strong>About seasons:</strong> a question that says "the 2019 season" means the
        season that started in 2019 (2019-20). Draft questions use the year of the draft itself.
      </div>

      <div className={styles.author}>
        <h3 className={styles.authorTitle}>About</h3>
        <p>
          Built by Chris Najera, a software engineer who loves basketball.
          For business questions or inquiries, contact{' '}
          <a href="mailto:hello@startingten.app">hello@startingten.app</a>.
        </p>
        <p className={styles.links}>
          <a href="https://github.com/cnajera-usd" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span aria-hidden="true">&bull;</span>
          <a href="https://www.linkedin.com/in/christopher-najera" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>

      <p className={styles.disclaimer}>
        This game is not affiliated with or endorsed by the NBA or any NBA team.
      </p>
    </Modal>
  )
}
