import { useState, useCallback } from 'react'

const KEY = 'nba-quiz-theme'

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'dark'
  )

  const toggle = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(KEY, next) } catch {}
    setTheme(next)
  }, [])

  return { theme, toggle }
}