import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodayPacific } from '../utils/pacificDate'
import { useStreak } from '@/hooks/useStreak'
import { getQuizNumber } from '@/utils/dailySeed'
import HeaderButtons from '../components/HeaderButtons'
import ReviewList from '@/components/ReviewList'
import styles from './Results.module.css'

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
  return `Starting 10 #${quizNum}\n${score}/10\n\n${grid}\n\nstartingten.app`
}

function getNextQuizCountdown() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const diff = tomorrow - now
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Results() {
  const navigate = useNavigate()
  const { streak, recordResult } = useStreak()
  const [timeLeft, setTimeLeft] = useState(getNextQuizCountdown)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getNextQuizCountdown()), 1000)
    return () => clearInterval(id)
  }, [])

  const saved = getSavedState()
  const todayKey = getTodayPacific()

  // Redirect if quiz not finished
  useEffect(() => {
    if (!saved || saved.dateKey !== todayKey || saved.status !== 'finished') {
      navigate('/')
    }
  }, [])

  const answers = saved?.answers ?? []
  const questions = saved?.questions ?? []
  const score = answers.filter(a => a.correct).length

  useEffect(() => {
    if (saved && saved.dateKey === todayKey && saved.status === 'finished') {
      recordResult(score)
    }
  }, [])

  if (!saved || saved.status !== 'finished') return null

  const grade = getGrade(score)

  function handleShare() {
    const quizNum = getQuizNumber()
    const text = buildShareText(answers, score, quizNum)
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'))
    }
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.toggleSlot}>
          <HeaderButtons />
        </div>
        <div className={styles.tag}>Quiz Complete</div>
        <div className={styles.score}>
          {score}<span className={styles.scoreDenom}>/10</span>
        </div>
        <div className={styles.grade}>{grade.label}</div>
        <div className={styles.gradeSub}>{grade.sub}</div>
        <div className={styles.nextQuiz}>
          <span className={styles.nextQuizDot} aria-hidden="true" />
          <span className={styles.nextQuizLabel}>Next quiz in</span>
          <span className={styles.nextQuizTime}>{timeLeft}</span>
        </div>
        <button className={styles.shareBtn} onClick={handleShare}>
          Share Result ↗
        </button>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: 'var(--green)' }}>{score}</div>
          <div className={styles.statLabel}>Correct</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: 'var(--red)' }}>{10 - score}</div>
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
                style={{ width: '100%' }}
              />
            </div>
            <div
              className={styles.rowIcon}
              style={{ color: ans.correct ? 'var(--green)' : 'var(--red)' }}
            >
              {ans.correct ? '✓' : '✗'}
            </div>
          </div>
        ))}
      </div>

      <ReviewList questions={questions} answers={answers} />

      {/* Actions */}

      <button className={styles.homeBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  )
}