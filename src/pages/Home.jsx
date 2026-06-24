import { useNavigate } from 'react-router-dom'
import { useStreak } from '@/hooks/useStreak'
import { getQuizNumber } from '@/utils/dailySeed'
import styles from './Home.module.css'

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function getSavedState() {
  try { return JSON.parse(localStorage.getItem('nba-quiz-state')) } catch { return null }
}

export default function Home() {
  const navigate = useNavigate()
  const { streak, bestStreak, totalPlayed, winPct } = useStreak()

  const saved = getSavedState()
  const todayKey = getTodayKey()
  const alreadyPlayed = saved?.dateKey === todayKey && saved?.status === 'finished'
  const inProgress = saved?.dateKey === todayKey && saved?.status === 'playing'
  const progressCount = saved?.dateKey === todayKey ? (saved?.answers?.length ?? 0) : 0

  const quizNumber = getQuizNumber()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className={styles.shell}>
      <svg className={styles.court} viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="210" cy="200" r="70" fill="none" stroke="white" strokeWidth="2" />
        <line x1="0" y1="155" x2="420" y2="155" stroke="white" strokeWidth="1.5" />
        <rect x="120" y="155" width="180" height="70" fill="none" stroke="white" strokeWidth="1.5" />
        <rect x="155" y="155" width="110" height="45" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="210" cy="155" r="22" fill="none" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className={styles.header}>
        <div className={styles.badge}>Daily Quiz</div>
        <h1 className={styles.title}>
          NBA<br /><span className={styles.accent}>Hoops</span><br />Quiz
        </h1>
        <p className={styles.subtitle}>10 questions &bull; New quiz every day</p>
      </div>

      <div className={styles.streakBar}>
        <div className={styles.streakIcon}>🔥</div>
        <div>
          <div className={styles.streakLabel}>Current streak</div>
          <div className={styles.streakVal}>{streak}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{totalPlayed}</div>
          <div className={styles.statLabel}>Played</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{winPct}%</div>
          <div className={styles.statLabel}>Win %</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{bestStreak}</div>
          <div className={styles.statLabel}>Best</div>
        </div>
      </div>

      {(inProgress || alreadyPlayed) && (
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            {alreadyPlayed ? "Today's result" : "Today's progress"}
          </div>
          <div className={styles.dots}>
            {Array.from({ length: 10 }, (_, i) => {
              if (alreadyPlayed) {
                const ans = saved?.answers?.[i]
                const cls = ans
                  ? ans.correct ? styles.dotCorrect : styles.dotWrong
                  : styles.dotEmpty
                return <div key={i} className={`${styles.dot} ${cls}`} />
              }
              return (
                <div
                  key={i}
                  className={`${styles.dot} ${i < progressCount ? styles.dotDone : styles.dotEmpty}`}
                />
              )
            })}
          </div>
        </div>
      )}

      <button
        className={styles.playBtn}
        onClick={() => navigate(alreadyPlayed ? '/results' : '/quiz')}
      >
        {alreadyPlayed ? "See Today's Results" : inProgress ? 'Continue Quiz ›' : "Play Today's Quiz ›"}
      </button>

      <div className={styles.dateLabel}>
        {today} &bull; Quiz #{quizNumber}
      </div>
    </div>
  )
}
