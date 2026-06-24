import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreak } from '@/hooks/useStreak'
import styles from './Results.module.css'

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function getSavedState() {
  try { return JSON.parse(localStorage.getItem('nba-quiz-state')) } catch { return null }
}

function getGrade(score) {
  if (score === 10) return { label: 'Perfect Game 🏆', sub: 'Flawless. Are you sure you\'re not an NBA scout?' }
  if (score >= 8)  return { label: 'Sharp Shooter 🎯', sub: 'Great game! You really know your hoops.' }
  if (score >= 6)  return { label: 'Sixth Man 🏀', sub: 'Solid effort. Keep watching those games!' }
  if (score >= 4)  return { label: 'Bench Player 📋', sub: 'Not bad, but there\'s room to improve.' }
  return           { label: 'Rookie 🧢', sub: 'Tough one. Come back tomorrow!' }
}

function buildShareText(answers, score, quizNum) {
  const grid = answers.map(a => a.correct ? '🟠' : '⬛').join('')
  return `NBA Daily Quiz #${quizNum}\n${score}/10\n\n${grid}\n\nnbadailyquiz.com`
}

function getNextQuizCountdown() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const diff = tomorrow - now
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return `${h}h ${m}m`
}

export default function Results() {
  const navigate = useNavigate()
  const { streak, recordResult } = useStreak()

  const saved = getSavedState()
  const todayKey = getTodayKey()

  // Redirect if quiz not finished
  useEffect(() => {
    if (!saved || saved.dateKey !== todayKey || saved.status !== 'finished') {
      navigate('/')
    }
  }, [])

  if (!saved || saved.status !== 'finished') return null

  const answers = saved.answers ?? []
  const score = answers.filter(a => a.correct).length
  const questions = saved.questions ?? []
  const grade = getGrade(score)

  // Record streak once
  useEffect(() => { recordResult(score) }, [])

  function handleShare() {
    const quizNum = Math.floor((new Date() - new Date('2025-01-01')) / 86400000) + 1
    const text = buildShareText(answers, score, quizNum)
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'))
    }
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tag}>Quiz Complete</div>
        <div className={styles.score}>
          {score}<span className={styles.scoreDenom}>/10</span>
        </div>
        <div className={styles.grade}>{grade.label}</div>
        <div className={styles.gradeSub}>{grade.sub}</div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: '#22c55e' }}>{score}</div>
          <div className={styles.statLabel}>Correct</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: '#ef4444' }}>{10 - score}</div>
          <div className={styles.statLabel}>Wrong</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <div className={styles.statVal}>🔥 {streak}</div>
          <div className={styles.statLabel}>Streak</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className={styles.breakdown}>
        <div className={styles.breakdownLabel}>Question breakdown</div>
        {answers.map((ans, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.rowNum}>Q{i + 1}</div>
            <div className={styles.rowBarWrap}>
              <div
                className={`${styles.rowBar} ${ans.correct ? styles.barCorrect : styles.barWrong}`}
                style={{ width: ans.correct ? '100%' : '30%' }}
              />
            </div>
            <div className={styles.rowIcon} style={{ color: ans.correct ? '#22c55e' : '#ef4444' }}>
              {ans.correct ? '✓' : '✗'}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <button className={styles.shareBtn} onClick={handleShare}>
        Share Result ↗
      </button>

      <button className={styles.homeBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className={styles.countdown}>
        Next quiz in {getNextQuizCountdown()}
      </div>
    </div>
  )
}
