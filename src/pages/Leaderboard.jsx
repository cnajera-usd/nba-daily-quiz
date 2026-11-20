import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLeaderboard } from '@/lib/leaderboard'
import HeaderButtons from '../components/HeaderButtons'
import styles from './Leaderboard.module.css'

const USE_MOCK = false

const MIN_GAMES = 5

const MOCK_ROWS = [
  { username: 'hoopsfan23', average_score: 8.4, games_played: 31, best_streak: 14 },
  { username: 'dimeDropper', average_score: 7.9, games_played: 12, best_streak: 12 },
  { username: 'paintBeast', average_score: 7.1, games_played: 40, best_streak: 9 },
  { username: 'courtVision', average_score: 6.8, games_played: 25, best_streak: 21 },
  { username: 'threeAndD', average_score: 6.2, games_played: 8, best_streak: 6 },
  { username: 'sixthMan', average_score: 5.7, games_played: 33, best_streak: 4 },
  { username: 'rimProtector', average_score: 5.1, games_played: 19, best_streak: 7 },
  { username: 'benchMob', average_score: 4.4, games_played: 6, best_streak: 3 },
]

const COLUMNS = [
  {
    key: 'average_score',
    label: 'Average',
    short: 'Avg',
    leaderLabel: 'Highest average',
    caption: `Ranked by average score · minimum ${MIN_GAMES} games`,
    format: v => Number(v).toFixed(1),
  },
  {
    key: 'games_played',
    label: 'Games',
    short: 'Games',
    leaderLabel: 'Most quizzes played',
    caption: 'Ranked by quizzes played',
    format: v => v,
  },
  {
    key: 'best_streak',
    label: 'Streak',
    short: 'Streak',
    leaderLabel: 'Longest streak',
    caption: 'Ranked by best streak',
    format: v => `🔥 ${v}`,
  },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState('average_score')

  useEffect(() => {
    if (USE_MOCK) {
      setRows(MOCK_ROWS)
      setLoading(false)
      return
    }
    let cancelled = false
    fetchLeaderboard().then(data => {
      if (!cancelled) {
        setRows(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  // Only show a tab if the data actually has that stat (Streak appears once the SQL returns it)
  const columns = useMemo(
    () => COLUMNS.filter(c => rows.some(r => r[c.key] !== undefined)),
    [rows]
  )
  const active = columns.find(c => c.key === sortKey) ?? columns[0]

  const sorted = useMemo(() => {
    if (!active) return []
    return [...rows].sort(
      (a, b) =>
        Number(b[active.key]) - Number(a[active.key]) ||
        Number(b.average_score) - Number(a.average_score) ||
        Number(b.games_played) - Number(a.games_played)
    )
  }, [rows, active])

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/')}
            aria-label="Back to Home"
        >
            ←
        </button>
        <div>
            <HeaderButtons />
        </div>
        </div>

      <div className={styles.header}>
        <div className={styles.tag}>Leaderboard</div>
        <h1 className={styles.title}>Top Players</h1>
      </div>

      {loading ? (
        <p className={styles.message}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p className={styles.message}>No one is on the board yet.</p>
      ) : (
        <>
          <div className={styles.segmented} role="group" aria-label="Rank leaderboard by">
            {columns.map(col => (
              <button
                key={col.key}
                type="button"
                className={`${styles.segment} ${active.key === col.key ? styles.segmentActive : ''}`}
                aria-pressed={active.key === col.key}
                onClick={() => setSortKey(col.key)}
              >
                {col.label}
              </button>
            ))}
          </div>

          <p className={styles.caption}>{active.caption}</p>

          <div className={styles.leader}>
            <div className={styles.leaderLabel}>🏆 {active.leaderLabel}</div>
            <div className={styles.leaderName}>{sorted[0].username}</div>
            <div className={styles.leaderValue}>{active.format(sorted[0][active.key])}</div>
          </div>

          <ol className={styles.list}>
            {sorted.map((row, i) => (
              <li key={row.username} className={`${styles.row} ${i < 3 ? styles.rowTop : ''}`}>
                <div className={styles.rank}>{i < 3 ? MEDALS[i] : i + 1}</div>
                <div className={styles.who}>
                  <div className={styles.name}>{row.username}</div>
                  <div className={styles.sub}>
                    {columns
                      .filter(c => c.key !== active.key)
                      .map(c => `${c.short} ${c.format(row[c.key])}`)
                      .join(' · ')}
                  </div>
                </div>
                <div className={styles.value}>{active.format(row[active.key])}</div>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}