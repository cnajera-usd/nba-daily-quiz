import { useState, useEffect } from 'react'

const STREAK_KEY = 'nba-quiz-streak'

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function getYesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalPlayed, setTotalPlayed] = useState(0)
  const [totalWins, setTotalWins] = useState(0) // wins = score >= 7

  useEffect(() => {
    const saved = localStorage.getItem(STREAK_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      // Reset streak if last play wasn't yesterday or today
      const active =
        data.lastPlayedKey === getTodayKey() ||
        data.lastPlayedKey === getYesterdayKey()
      setStreak(active ? data.streak : 0)
      setBestStreak(data.bestStreak ?? 0)
      setTotalPlayed(data.totalPlayed ?? 0)
      setTotalWins(data.totalWins ?? 0)
    }
  }, [])

  function recordResult(score) {
    const saved = localStorage.getItem(STREAK_KEY)
    const data = saved ? JSON.parse(saved) : {}
    const today = getTodayKey()

    // Don't double-count if already played today
    if (data.lastPlayedKey === today) return

    const isWin = score >= 7
    const prevStreak = data.lastPlayedKey === getYesterdayKey() ? (data.streak ?? 0) : 0
    const newStreak = isWin ? prevStreak + 1 : 0
    const newBest = Math.max(data.bestStreak ?? 0, newStreak)
    const newTotal = (data.totalPlayed ?? 0) + 1
    const newWins = (data.totalWins ?? 0) + (isWin ? 1 : 0)

    const updated = {
      lastPlayedKey: today,
      streak: newStreak,
      bestStreak: newBest,
      totalPlayed: newTotal,
      totalWins: newWins,
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated))
    setStreak(newStreak)
    setBestStreak(newBest)
    setTotalPlayed(newTotal)
    setTotalWins(newWins)
  }

  const winPct = totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0

  return { streak, bestStreak, totalPlayed, winPct, recordResult }
}
