import { Link } from 'react-router-dom'
import styles from './Privacy.module.css'

// Change this to an inbox you actually check
const CONTACT_EMAIL = 'hello@startingten.app'

export default function Terms() {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>← Starting 10</Link>

        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated November 24, 2026</p>

        <p>
          By using Starting 10 (startingten.app), you agree to these terms. If you do not agree,
          please do not use the game.
        </p>

        <h2>The game</h2>
        <p>
          Starting 10 is a free daily NBA trivia game, provided for entertainment. We try to keep
          questions accurate, but some may contain errors, and the game is provided "as is"
          without warranties of any kind. We may change, pause, or end the game at any time.
        </p>

        <h2>Accounts and usernames</h2>
        <ul>
          <li>You may play as a guest or sign in with Google.</li>
          <li>
            Usernames are public. Do not use a name that is offensive, hateful, or
            impersonates someone else.
          </li>
          <li>
            We may remove usernames, scores, or accounts that break these rules or that cheat
            or abuse the game.
          </li>
          <li>
            Leaderboard stats may be reset or adjusted if needed, for example after a bug or at
            launch.
          </li>
        </ul>

        <h2>Fair use</h2>
        <p>
          Do not try to break, overload, or gain unfair access to the game or its data, or use
          bots or scripts to play or submit scores.
        </p>

        <h2>No affiliation with the NBA</h2>
        <p>
          Starting 10 is not affiliated with or endorsed by the NBA or any NBA team. Team and
          player names are used only to describe basketball facts.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent allowed by law, Starting 10 and its creator are not liable for any
          losses or damages arising from your use of the game.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. If we do, we will change the date at the top of this page.
          Continuing to use the game means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}