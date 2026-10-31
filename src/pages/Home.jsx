import { useNavigate } from 'react-router-dom'
import { useStreak } from '@/hooks/useStreak'
import { getQuizNumber } from '@/utils/dailySeed'
import { getTodayPacific } from '../utils/pacificDate'
import HeaderButtons from '../components/HeaderButtons'
import ThemeToggle from '@/components/ThemeToggle'
import BallIcon from '../components/BallIcon'
import styles from './Home.module.css'

function getSavedState() {
  try { return JSON.parse(localStorage.getItem('nba-quiz-state')) } catch { return null }
}

export default function Home() {
  const navigate = useNavigate()
  const { streak, bestStreak, totalPlayed, averageScore } = useStreak()

  const saved = getSavedState()
  const todayKey = getTodayPacific()
  const alreadyPlayed = saved?.dateKey === todayKey && saved?.status === 'finished'
  const inProgress = saved?.dateKey === todayKey && saved?.status === 'playing'
  const progressCount = saved?.dateKey === todayKey ? (saved?.answers?.length ?? 0) : 0

  const quizNumber = getQuizNumber()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles',
  })
  const [weekday, ...rest] = today.split(', ')

  return (
    <div className={styles.shell}>
      <svg
        className={styles.court}
        viewBox="0 0 500 470"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* tinted paint */}
        <rect className={styles.courtKey} x="170" y="0" width="160" height="190" />

        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* sidelines, baseline and half-court line */}
          <rect x="1" y="1" width="498" height="468" />

          {/* lane */}
          <path d="M170 0 V190 H330 V0" />

          {/* free-throw circle: solid outside the lane, dashed inside */}
          <path d="M190 190 A60 60 0 0 0 310 190" />
          <path d="M190 190 A60 60 0 0 1 310 190" strokeDasharray="8 8" />

          {/* backboard, neck and rim */}
          <path d="M220 40 H280" strokeWidth="4" />
          <path d="M250 40 V45" />
          <circle cx="250" cy="52.5" r="7.5" />

          {/* restricted area */}
          <path d="M210 40 V52.5 A40 40 0 0 0 290 52.5 V40" />

          {/* three-point line */}
          <path d="M30 0 V142 A237.5 237.5 0 0 0 470 142 V0" />

          {/* half-court circle */}
          <path d="M190 469 A60 60 0 0 1 310 469" />
        </g>
      </svg>

      <div className={styles.toggleSlot}>
        <HeaderButtons />
      </div>

      <div className={styles.header}>
        <div className={styles.badge}>Daily Quiz &bull; #{quizNumber}</div>
        <h1 className={styles.title} aria-label="Starting Ten">
          <span className={styles.titleTop} aria-hidden="true">Starting</span>
          <span className={styles.titleBig} aria-hidden="true">
            1<BallIcon className={styles.ball} />
          </span>
        </h1>
        <p className={styles.subtitle}>10 questions &bull; New every day</p>
      </div>

      <div className={styles.streakBar}>
        <div className={styles.streakIcon}>🔥</div>
        <div>
          <div className={styles.streakLabel}>Current streak</div>
          <div className={styles.streakVal}><span className={styles.flame}>🔥</span>{streak}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{totalPlayed}</div>
          <div className={styles.statLabel}>Quizzes Played</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{averageScore}</div>
          <div className={styles.statLabel}>Avg Score</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statCol}>
          <div className={styles.statVal}>{bestStreak}</div>
          <div className={styles.statLabel}>Best Streak</div>
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
        <span>
          <span className={styles.dateDay}>{weekday}</span> {rest.join(', ')}
        </span>
      </div>
      <p className={styles.disclaimer}>
        Not affiliated with or endorsed by the NBA or any NBA team.
      </p>
    </div>
  )
}