import { useState, useEffect } from 'react'
import { fetchMyAttempts } from '@/lib/attempts'
import { computeStats } from '@/lib/stats'

const EMPTY = computeStats([])

export function useMyStats() {
  const [stats, setStats] = useState(EMPTY)

  useEffect(() => {
    let cancelled = false
    fetchMyAttempts().then((attempts) => {
      if (!cancelled) setStats(computeStats(attempts))
    })
    return () => {
      cancelled = true
    }
  }, [])

  return stats
}