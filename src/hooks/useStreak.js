import { useState, useEffect } from 'react'
import { getTodayPacific, getYesterdayPacific } from '../utils/pacificDate'

const STREAK_KEY = 'nba-quiz-streak'


export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalPlayed, setTotalPlayed] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem(STREAK_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      // Reset streak if last play wasn't yesterday or today
      const active =
        data.lastPlayedKey === getTodayPacific() ||
        data.lastPlayedKey === getYesterdayPacific()
      setStreak(active ? data.streak : 0)
      setBestStreak(data.bestStreak ?? 0)
      setTotalPlayed(data.totalPlayed ?? 0)
      setTotalScore(data.totalScore ?? 0)
    }
  }, [])

  function recordResult(score) {
    const saved = localStorage.getItem(STREAK_KEY)
    const data = saved ? JSON.parse(saved) : {}
    const today = getTodayPacific()

    // Don't double-count if already played today
    if (data.lastPlayedKey === today) return

    const prevStreak = data.lastPlayedKey === getYesterdayPacific() ? (data.streak ?? 0) : 0
    const newStreak = prevStreak + 1
    const newBest = Math.max(data.bestStreak ?? 0, newStreak)
    const newTotalScore = (data.totalScore?? 0) + score
    const newTotal = (data.totalPlayed ?? 0) + 1
    

    const updated = {
      lastPlayedKey: today,
      streak: newStreak,
      bestStreak: newBest,
      totalPlayed: newTotal,
      totalScore: newTotalScore
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated))
    setStreak(newStreak)
    setBestStreak(newBest)
    setTotalPlayed(newTotal)
    setTotalScore(newTotalScore)
  }

  const averageScore = totalPlayed > 0 ? (totalScore / totalPlayed).toFixed(1) : '0.0'
  
  return { streak, bestStreak, totalPlayed, averageScore, recordResult }
}
