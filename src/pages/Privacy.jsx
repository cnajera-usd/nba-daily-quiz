import { Link } from 'react-router-dom'
import styles from './Privacy.module.css'

// Change this to an inbox you actually check
const CONTACT_EMAIL = 'hello@startingten.app'

export default function Privacy() {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>← Starting 10</Link>

        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated November 24, 2026</p>

        <p>
          Starting 10 (startingten.app) is a free daily NBA trivia game made by Chris Najera.
          This page explains what information the game collects and how it is used.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Guest play:</strong> when you open the game, an anonymous ID is created
            automatically. We store your quiz answers and scores under that ID.
          </li>
          <li>
            <strong>Username:</strong> if you join the leaderboard, the username you choose.
            Your username and leaderboard stats are public.
          </li>
          <li>
            <strong>Google sign-in:</strong> if you sign in with Google, we receive your email
            address and basic profile information (such as your name) from Google. We use it only
            to log you in and keep your progress on your account. We never see your Google
            password, and we do not show your email or Google name to other players.
          </li>
          <li>
            <strong>On your device:</strong> your game progress and theme setting are stored in
            your browser.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use this information to run the game, show the leaderboard, and sync your stats
          across your devices. We do not sell your information or use it for advertising.
        </p>

        <h2>Who handles your data</h2>
        <p>
          Starting 10 uses Supabase to store accounts and game data, Vercel to host the website,
          and Google to provide sign-in. These services process data on our behalf.
        </p>

        <h2>Deleting your data</h2>
        <p>
          To delete your account and the data tied to it, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will remove it.
        </p>

        <h2>Children</h2>
        <p>
        Starting 10 is a general-audience trivia game. We do not knowingly collect personal
        information from children under 13. If you believe a child has given us personal
        information, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
        delete it.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, we will update the date at the top of this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className={styles.fine}>
          Not affiliated with or endorsed by the NBA or any NBA team.
        </p>
      </div>
    </div>
  )
}