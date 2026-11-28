import { useState, useEffect } from 'react'
import { syncTodayFromServer } from '@/lib/syncToday'

// Returns true once the "did I already play today?" check against the database has finished
export function useSyncToday() {
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    let cancelled = false
    syncTodayFromServer()
      .catch((err) => console.error('Sync failed:', err))
      .then(() => {
        if (!cancelled) setSynced(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return synced
}