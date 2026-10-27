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

      <p className={styles.disclaimer}>
        This game is not affiliated with or endorsed by the NBA or any NBA team.
      </p>
    </Modal>
  )
}