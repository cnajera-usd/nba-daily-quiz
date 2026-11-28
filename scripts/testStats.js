import { computeStats } from '../src/lib/stats.js'
import { getTodayPacific, getYesterdayPacific } from '../src/utils/pacificDate.js'

function check(name, actual, expected) {
    const failures = Object.keys(expected).filter((key) => actual[key] !== expected[key])
    if (failures.length === 0) {
        console.log(`PASS: ${name}`)
        return
    }
    console.log(`FAIL: ${name}`)
    for (const key of failures) {
        console.log(`  ${key}: expected ${expected[key]}, got ${actual[key]}`)
    }
}

// 1. New player with no attempts
check('no attempts', computeStats([]), {
    streak: 0,
    bestStreak: 0,
    totalPlayed: 0,
    averageScore: '0.0',
})

// 2. Three consecutive old days: best streak 3, but not current
check(
    'three consecutive old days',
    computeStats([
        { quiz_date: '2026-01-01', score: 6 },
        { quiz_date: '2026-01-02', score: 8 },
        { quiz_date: '2026-01-03', score: 10 },
    ]),
    { streak: 0, bestStreak: 3, totalPlayed: 3, averageScore: '8.0' }
)

// 3. A gap breaks the run: Jan 1-2, skip, Jan 5
check(
    'gap breaks the streak',
    computeStats([
        { quiz_date: '2026-01-01', score: 5 },
        { quiz_date: '2026-01-02', score: 5 },
        { quiz_date: '2026-01-05', score: 5 },
    ]),
    { streak: 0, bestStreak: 2, totalPlayed: 3, averageScore: '5.0' }
)

// 4. Played yesterday and today: current streak is active
check(
    'yesterday and today',
    computeStats([
        { quiz_date: getYesterdayPacific(), score: 7 },
        { quiz_date: getTodayPacific(), score: 9 },
    ]),
    { streak: 2, bestStreak: 2, totalPlayed: 2, averageScore: '8.0' }
)

// 5. Last played two days ago: streak is over
const twoDaysAgo = new Date(getTodayPacific())
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
check(
    'last played two days ago',
    computeStats([{ quiz_date: twoDaysAgo.toISOString().slice(0, 10), score: 4 }]),
    { streak: 0, bestStreak: 1, totalPlayed: 1, averageScore: '4.0' }
)