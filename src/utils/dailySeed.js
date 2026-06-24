/**
 * Returns a deterministic seed based on today's date (YYYY-MM-DD).
 * Everyone playing on the same day gets the same quiz.
 */
export function getDailySeed() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Seeded shuffle — same seed always produces the same order.
 */
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

/**
 * Pick `count` questions from the full bank using today's seed.
 * Shuffles and slices, so every day is a different set.
 */
export function getDailyQuestions(allQuestions, count = 10) {
  const seed = getDailySeed()
  const rand = seededRandom(seed)
  const shuffled = [...allQuestions].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Returns a zero-padded quiz number based on days since app launch.
 * Set LAUNCH_DATE to when you go live.
 */
const LAUNCH_DATE = new Date('2025-01-01')

export function getQuizNumber() {
  const today = new Date()
  const diff = Math.floor((today - LAUNCH_DATE) / (1000 * 60 * 60 * 24))
  return diff + 1
}
